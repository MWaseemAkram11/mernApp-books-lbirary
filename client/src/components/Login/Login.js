import React, { useState } from 'react';
import network from '../../utils/network';
import "./Login.css"

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState('');

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

  var raw = JSON.stringify({
    email:email,password:password
  });
    
  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
};

  const handleLogin = async () => {
    const validate = await handleValidation();
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
      <form>
        <div className='form-childs'>
          <span>Email:</span>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className='form-childs'>
          <span>Password:</span>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className='form-childs'>
          <button className='btn' type="button" onClick={handleLogin}>
            Login
          </button>
        </div>
      </form>
    </div>
    </>
  );
};

export default Login;
