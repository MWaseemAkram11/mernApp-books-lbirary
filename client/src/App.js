import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './components/Login/Login'
import Register from './components/Register/Register'
import Home from './pages/Home'
import AddBooks from './components/AddBook/AddBooks'
import './App.css'

function App () {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register/>} />
          <Route path='/' element={<Home/>} />
          <Route path='/add-books' element={<AddBooks/>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
