import React, { useState } from 'react';
import network from '../../utils/network';
import "./Login.css"

const Login = () => {
  const [formData, setFormdata] = useState({
    email:'', password:''
  })
  const [errors, setErrors] = useState('');

  const handleChange = () =>{
    const {name, value} = e.target;
    if(name === "email"){
      setFormData({...formData, email:e.target.value});
      setErrors({...errors, email:''})
    } else if(name === "password"){
      setFormData({...formData, password:e.target.value});
      setErrors({...errors, password:''})
    }
  }

  const handleValidation = () =>{
    const regexEmail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    var newErrors = {};
    const email = email; const pwd = password;
    if(email === '') 
      newErrors.email = 'please enter your email';
    if (!regexEmail.test(email))
      newErrors.email = 'please enter valid email';
    if (password === '')
      newErrors.password = 'please enter your password';
    if (password.length > 8 || password.length < 8)
      newErrors.password = 'please enter valid password';
      setErrors(newErrors);
  }

  var raw = JSON.stringify(formData);
    
  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const validate = handleValidation();
    if(validate){
      fetch(network.baseUrl + "/login", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.success == true) {
          Swal.fire(
              'Good job!',
              'You has ben loggedIn!',
              'success'
          );
          navigate("/");
        }
      })
      .catch((error) => {
          Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Something went wrong!',
          })
        console.log("error", error);
      });
    }
    console.log('Logging in...', email, password);
  };

  return (
    <>
     <div className="signup">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className='form-childs'>
          <span>Email:</span>
          <input
            type="email"
            placeholder="Email"
            name='email'
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className='form-childs'>
          <span>Password:</span>
          <input
            type="password"
            placeholder="Password"
            name='password'
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div className='form-childs'>
          <button className='btn' type="submit">
            Login
          </button>
        </div>
      </form>
    </div>
    </>
  );
};

export default Login;
