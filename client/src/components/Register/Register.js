/* eslint-disable */
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import network from '../../utils/network';
import Swal from 'sweetalert2';
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name:'', email:'', password:''
  })

  const [errors, setErrors] = useState('');

  const handleChange = (e) =>{
    const {name,value} = e.target;
    if(name === "name"){
      setFormData({...formData, name:e.target.value});
      setErrors({...errors, name:''})
    } else  if(name === "email"){
      setFormData({...formData, email:e.target.value});
      setErrors({...errors, email:''})
    } else if(name === "password"){
      setFormData({...formData, password:e.target.value});
      setErrors({...errors, password:''})
    }
  }

  const handleValidation = () =>{
    const { name, email, password} = formData;
    var newErrors = {};
    const regexEmail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    if(name === ''){
      newErrors.name = 'please enter your name'
    }
    if(email === ''){
      newErrors.email = 'please enter your email'
    }
    if (!regexEmail.test(email)){
      newErrors.email = 'please enter valid email';
    }
   if(name === ''){
      newErrors.name = 'please enter your name'
    }
   if (password === ''){
      newErrors.password = 'please enter your password';
    }
    setErrors(newErrors);
  }

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  var raw = JSON.stringify(formData);

  var raw = JSON.stringify(formData);
    
  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
  };

  const handleSignup = (e) => {
    e.preventDefault();
    const validate = handleValidation();
    if(errors && Object.keys(errors).length === 0){
      fetch(network.baseUrl + "/register", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.success === true) {
          Swal.fire(
              'Good job!',
              'You has been registered!',
              'success'
          );
          navigate("/login");
        }
      })
      .catch((error) => {
          Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Something went wrong!',
          })
      });
  }
  }
  return (
    <div className="signup">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <div className='form-childs'>
          <span>Name:</span>
          <input
            type="text"
            name='name'
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
          />
          <span style={{color:"red"}}>{errors.name ? errors.name : ""}</span>
        </div>
        <div className='form-childs'>
          <span>Email:</span>
          <input
            type="email"
            name='email'
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <span style={{color:"red"}}>{errors.email ? errors.email : ""}</span>

        </div>
        <div className='form-childs'>
          <span>Password:</span>
          <input type="password" 
            name='password'
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <span style={{color:"red"}}>{errors.password ? errors.password : ""}</span>

        </div>
        <div className='form-childs'>
          <button className='btn' type="submit" value='submit'>
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
  };

export default Register
