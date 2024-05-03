import React, { useState } from 'react';
import './App.css';

const Login = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userFormData, setUserFormData] = useState({
    userName: "",
    password: ""
  });

  function handleInputChange(e) {
    setUserFormData({ ...userFormData, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    try {
      const response = await fetch('http://127.0.0.1:8081/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userFormData)
      });
  
      console.log('Response:', response); // Log the response received from the server
  
      if (response.ok) {
        // Login successful
        setLoading(false);
        onLogin(); // Notify parent component about successful login
      } else {
        // Login failed
        throw new Error('Invalid username or password');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Invalid username or password.');
      setLoading(false);
    }
  };
  

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username:</label>
          <input type="text" className="form-control" id="userName" name="userName" placeholder="Username" onChange={handleInputChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password:</label>
          <input type="text" className="form-control" id="password" name="password" placeholder="Password" onChange={handleInputChange} />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>Login</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default Login;
