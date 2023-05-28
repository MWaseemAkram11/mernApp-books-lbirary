import React, { useState } from 'react';
import "./Login.css"

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Perform login logic here
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
