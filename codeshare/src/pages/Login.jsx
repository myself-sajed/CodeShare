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
        <div className="p-3 lg:h-screen lg:w-[80%] md:w-[90%] w-full mx-auto">
            <img src="/assets/logo.png" draggable="false" className="h-24 mx-auto md:m-0" alt="logo" />
            <div className='md:grid grid-cols-2 gap-5'>
                <div className='md:text-5xl mb-3 md:m-0 text-2xl font-bold text-left hidden md:block'>
                    <p className=' text-blue-500 my-0'>The best platform for </p>
                    <p className='text-blue-800'>Realtime Coding.</p>
                    <p></p>
                    <img src="/assets/hero.svg" draggable="false" className='md:block hidden h-72 responsive mt-5' alt="" />
                </div>
                <p className='text-center text-3xl font-bold my-3 block md:hidden'><span className="text-blue-500">The best platform for</span> <span className="text-blue-800">Realtime Coding.</span></p>
                <div className='bg-blue-100 rounded-[20px] p-3  mx-auto my-5 w-full'>
                    <img src="/assets/logo.png" draggable="false" className='h-36 mx-auto' alt="logo" />
                    <div className='flex flex-col mx-auto gap-3 w-full md:w-[80%]'>

                        <p className='text-blue-500 text-sm my-0'>Paste Invitation Room ID here</p>

                        {/* INPUTS */}

                        {/* 1. ROOM ID */}
                        <input type="text" value={roomID} onChange={(e) => { setRoomID(e.target.value) }} placeholder="Enter or paste Room ID" className="p-3 text-lg bg-transparent outline-none border border-blue-400 rounded-full" onKeyUp={checkEnter} />

                        {/* 2. USERNAME */}
                        <input type="text" value={username} onChange={(e) => { setUsername(e.target.value) }} placeholder="Enter Username" className="p-3 text-lg bg-transparent outline-none border border-blue-400 rounded-full" onKeyUp={checkEnter} />

                        <button className='p-3 bg-blue-600 text-white rounded-full hover:bg-blue-800 ease-in-out duration-300 text-lg' onClick={createRoom}>Join Room</button>
                    </div>
                    <p className='text-center my-10'>If you don't have an invite, <span className='text-blue-600 cursor-pointer hover:text-blue-900 font-bold ease-in-out duration-300' onClick={generateRoomId}>Create a Room</span></p>
                </div>
            </div>
        </div>
    )
}

export default Login