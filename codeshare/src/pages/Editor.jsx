import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import React, { useEffect, useRef, useState } from 'react'
import Avatar from 'react-avatar'
import toast from 'react-hot-toast'
import { useLocation, useNavigate, useParams, Navigate } from 'react-router-dom'
import { initSocket } from '../socket'

const Editor = () => {

    // socket state
    const [clients, setClients] = useState(null)


    // States
    const location = useLocation()
    const navigate = useNavigate()
    const editorRef = useRef()
    const socketRef = useRef(null)
    const { roomID } = useParams()
    const codeRef = useRef(null)





    // handeling socket 
    useEffect(() => {

        async function socketHandler() {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));

            socketRef.current.emit('join', {
                roomID,
                username: location.state?.username,
            });

            socketRef.current.on('joined', ({ allClients, username, socketID }) => {


                if (username !== location.state?.username) {
                    toast.success(`${username} joined the room`)
                }
                socketRef.current.emit('code-sync', {
                    code: codeRef.current,
                    roomID,
                    socketID,
                });
                setClients(allClients)
            })

            // Listening for disconnected
            socketRef.current.on('disconnected', ({ socketID, username }) => {
                toast.success(`${username} left the room.`);
                setClients((prev) => {
                    return prev.filter(
                        (client) => client.socketID !== socketID
                    );
                });
            }
            );

        }

        socketHandler();

        return () => {
            socketRef.current.disconnect();
            socketRef.current.off('joined');
            socketRef.current.off('disconnected');
        };


    }, [])

    // handle socket errors
    function handleErrors(err) {
        navigate('/')
        toast.error(err);

    }

    // Copy Room ID
    function copyRoomID() {
        navigator.clipboard.writeText(location.state.roomID);
        toast.success('Room ID copied!')

    }

    // Leave the room
    function leaveRoom() {
        navigate('/')
        toast.success('You left the Room.')
    }

    // Integrating codemirror
    useEffect(() => {
        async function init() {
            editorRef.current = Codemirror.fromTextArea(
                document.getElementById('editor'),
                {
                    mode: { name: 'javascript', json: true },
                    theme: 'dracula',
                    autoCloseTags: true,
                    autoCloseBrackets: true,
                    lineNumbers: true,
                    lineWrapping: true,
                    indentUnit: 4,
                    tabSize: 4,
                    indentWithTabs: true,
                    matchTags: { bothTags: true },
                    extraKeys: {
                        'Ctrl-Space': 'autocomplete',
                    },
                }
            );

            const el = document.getElementsByClassName('CodeMirror')[0]
            el.style.height = '100vh '
            el.style.fontSize = '20px '
            el.style.cursor = 'text'
        }
        init()



    }, [])

    // Code Sync
    useEffect(() => {
        if (socketRef.current) {
            editorRef.current.focus()
            editorRef.current.on('change', (instance, action) => {
                codeRef.current = instance.getValue()
                if (action.origin !== 'setValue') {
                    socketRef.current.emit('code-change', {
                        code: instance.getValue(),
                        roomID,
                    });
                }
            })

            socketRef.current.on('code-change', ({ code, socketID, username }) => {
                // select the element who is changing the code
                const avatar = document.getElementById(socketID)
                avatar.classList.remove('hidden')
                setTimeout(() => {
                    avatar.classList.add('hidden')
                }, 1000)



                editorRef.current.focus()
                editorRef.current.setValue(code);
            })

            socketRef.current.on('code-sync', ({ code }) => {
                editorRef.current.focus()
                editorRef.current.setValue(code);
            })
        }

    }, [socketRef.current])

    if (!location.state) {
        return <Navigate to="/" />;
    }


    return (

        <div>
            {/* EDITOR PAGE */}
            <div className="flex items-start justify-start h-screen">

                {/* LEFT SECTION */}
                <div className="bg-blue-100 w-72 h-screen p-2">
                    <div className='relative'>
                        <img src="/assets/logo.png" draggable="false" className='h-36 mx-auto border-b-2' alt="logo" />
                        <div className='w-full h-1 bg-blue-600 absolute bottom-5'></div>
                    </div>

                    <div className='flex flex-row gap-2 items-center cursor-pointer '>
                        <Avatar size='40px' name={location.state.username} color='red' className=' rounded-full ' />
                        <span className='font-bold  text-center text-sm text-ellipsis overflow-hidden'>{location.state.username} (You)</span>
                    </div>
                    <p className='mt-3 text-lg'>Other Connected Clients</p>
                    <div className='flex flex-col h-[430px]'>

                        {/* DISPLAY ALL CONNECTED CLIENTS */}
                        <div className='flex items-start justify-start gap-3 flex-wrap flex-1 overflow-y-scroll change__scrollbar' style={{ alignContent: 'flex-start' }} >



                            {
                                clients && clients.map((client, index) => {

                                    return (
                                        client.username !== location.state.username && (<div key={index} className='flex cursor-pointer items-center justify-center flex-col gap-1 h-28 relative border border-blue-400 bg-blue-200 rounded-lg'>
                                            <p className='text-sm text-green-900 absolute top-[0px] hidden' id={client.socketID}>Typing...</p>
                                            <Avatar size='40px' name={client.username} color='blue' className='rounded-full' />
                                            <span className='font-bold text-center text-sm w-[100px] text-ellipsis overflow-hidden'>{client.username}</span>
                                        </div>)
                                    )
                                })
                            }



                        </div>

                        {/* OTHER OPTIONS */}

                        <div className='flex flex-col gap-2 mx-5'>
                            <button className='p-3 rounded-full bg-green-700 text-white ease-in-out duration-300 hover:bg-green-900 mt-5' onClick={copyRoomID}>Copy Room ID</button>
                            <button className='p-3 rounded-full bg-red-700 mb-5 ease-in-out duration-300 hover:bg-red-900 text-white' onClick={leaveRoom} >Leave Room</button>
                        </div>
                    </div>
                    <div>

                    </div>
                </div>


                {/* RIGHT SECTION */}
                <div className='flex-1 h-screen overflow-auto change__scrollbar'>
                    <textarea id='editor' />
                </div>
            </div>
        </div>
    )
}

export default Editor