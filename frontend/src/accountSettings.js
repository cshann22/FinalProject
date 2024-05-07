import React, { useState } from 'react';
import { useUser } from './userContext'; // Import the useUser hook
import 'bootstrap/dist/css/bootstrap.min.css';
const AccountSettings = ({ onSwitchView }) => {
  const { userId } = useUser(); // Access the userId from the context
  const [name, setName] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://127.0.0.1:8081/updateUser/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, userName, password }),
      });
      if (response.ok) {
        setMessage('Account updated successfully!');
      } else {
        setMessage('Error updating account. Please try again later.');
      }
    } catch (error) {
      console.error('Error updating account:', error);
      setMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="container mt-0">
      <h2>Account Settings</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            className="form-control"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-success mr-2">Update</button>
        <button type="button" className="btn btn-secondary" onClick={() => onSwitchView('dashboard')}>Back to Dashboard</button>
      </form>
      {message && <p className="mt-3">{message}</p>}
    </div>
  );
};

export default AccountSettings;
