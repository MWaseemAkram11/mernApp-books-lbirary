import React, { useState } from 'react';
import "./header.css";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate()
  const login = () =>{
    navigate('/login')
  }
  const signup = () => {
    navigate('/register')
  }

  return (
    <header>
      <div className="container logo">Book Shelve System</div>
      <nav>
        <ul>
          <li onClick={login}>Login</li>
          <li onClick={signup}>Sign Up</li>
        </ul>
      </nav>
    </header>
  )
}

export default Header
