import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { v4 as uuid } from 'uuid'

const Login = () => {

    // States
    const [roomID, setRoomID] = useState('')
    const [username, setUsername] = useState('')
    const navigate = useNavigate()

    const superheroes = [
        "Batman",
        "Spider-Man",
        "Iron Man",
        "Captain America",
        "Thor",
        "Hulk",
        "Black Panther",
        "Hulk",
        "Krrish",
        "Thanos",
        "Doctor Strange",
        "Joker",
    ];

    // Generating Room ID
    function generateRoomId() {
        const ID = uuid()
        setRoomID(ID)
        setUsername(superheroes[Math.floor(Math.random() * superheroes.length)])
        toast.success('Room ID generated successfully!')
    }

    // Creating Room 
    function createRoom() {
        if (roomID === '' || username === '') {
            toast.error('All fields are required!')
        } else {
            navigate(`/editor/${roomID}`, { state: { username: username, roomID: roomID } })
            toast.success('Room created successfully!')
        }
    }

    function checkEnter(event) {
        if (event.key === 'Enter') {
            createRoom()
        }
    }


    return (
        <div className="p-3 pl-20 h-screen bg-blue-200">
            <img src="/assets/logo.png" draggable="false" className="h-36" alt="logo" />
            <div className='max-h-screen flex align-start justify-start gap-20 mx-auto'>
                <div>
                    <p className='text-5xl ml-10 font-bold text-blue-500'>The best platform for <br />
                        <span className='text-blue-800 ml-2'>Realtime Coding</span></p>
                    <img src="/assets/hero.svg" draggable="false" className='h-96 responsive' alt="" />
                </div>
                <div className='bg-blue-100 rounded-[20px] p-3 w-[500px] '>
                    <img src="/assets/logo.png" draggable="false" className='h-36 mx-auto' alt="logo" />
                    <div className='flex flex-col mx-10 gap-3'>

                        <p className='text-blue-500 text-sm my-0'>Paste Invitation Room ID here</p>

                        {/* INPUTS */}

                        {/* 1. ROOM ID */}
                        <input type="text" value={roomID} onChange={(e) => { setRoomID(e.target.value) }} placeholder="Enter or paste Room ID" className="p-3 text-lg bg-transparent outline-none border border-blue-400 rounded-full" onKeyUp={checkEnter} />

                        {/* 2. USERNAME */}
                        <input type="text" value={username} onChange={(e) => { setUsername(e.target.value) }} placeholder="Enter Username" className="p-3 text-lg bg-transparent outline-none border border-blue-400 rounded-full" onKeyUp={checkEnter} />

                        <button className='p-3 bg-blue-600 text-white rounded-full hover:bg-blue-800 ease-in-out duration-300 text-lg' onClick={createRoom}>Join Room</button>
                    </div>
                    <p className='text-center mt-10'>If you don't have an invite, <span className='text-blue-600 cursor-pointer hover:text-blue-900 font-bold ease-in-out duration-300' onClick={generateRoomId}>Create a Room</span></p>
                </div>
            </div>
        </div>
    )
}

export default Login