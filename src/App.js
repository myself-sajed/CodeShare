import React from 'react'
import { Toaster } from 'react-hot-toast'
import Login from './pages/Login'
import { Routes, Route } from 'react-router-dom'
import Editor from './pages/Editor'

const App = () => {
  return (
    <div>
      <Toaster />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/editor/:roomID" element={<Editor />} />
      </Routes>

    </div>
  )
}

export default App