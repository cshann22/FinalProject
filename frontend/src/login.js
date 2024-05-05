import React, { useState } from 'react';
import './App.css';
import { useUser } from './userContext'; // Import the useUser hook

const Login = ({ onLogin, handleSwitchView }) => {
  const { setUserData } = useUser(); // Access the setUserData function from the context

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

    const response = await fetch('http://127.0.0.1:8081/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userFormData)
    });

    if (response.ok) {
      const data = await response.json();
      setUserData(data.user.id); // Set the user ID in the context
      setLoading(false);
      onLogin(); // Notify parent component about successful login
    } else {
      // Login failed
      console.error('Error logging in:', response.statusText);
      setError('Invalid username or password.');
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="login-box p-4 border rounded">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username:</label>
            <input type="text" className="form-control" id="userName" name="userName" placeholder="Username" onChange={handleInputChange} />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password:</label>
            <input type="password" className="form-control" id="password" name="password" placeholder="Password" onChange={handleInputChange} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>Login</button>
          {error && <p>{error}</p>}
        </form>
        <div className="d-flex justify-content-between mt-3">
          <button className="btn btn-outline-primary" onClick={() => handleSwitchView('createUser')}>Create Account</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
