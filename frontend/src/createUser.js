import React, { useState } from 'react';
import './App.css';

const CreateUser = () => {
  const [name, setName] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [userFormData, setUserFormData] = useState({
    name: "",
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
    setSuccessMessage('');

    try {
      const response = await fetch('http://127.0.0.1:8081/createUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userFormData)
      });

      if (!response.ok) {
        throw new Error('User creation failed');
      }

      // User created successfully
      setLoading(false);
      setName('');
      setUserName('');
      setPassword('');
      setSuccessMessage('User created successfully!');
    } catch (error) {
      console.error('Error creating user:', error);
      setError('An error occurred while creating the user.');
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Create User</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name:</label>
          <input type="text" className="form-control" id="name" name="name" placeholder="Name" onChange={handleInputChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="userName" className="form-label">Username:</label>
          <input type="text" className="form-control" id="userName" name="userName" placeholder="Username" onChange={handleInputChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password:</label>
          <input type="password" className="form-control" id="password" name="password" placeholder="Password" onChange={handleInputChange} />
        </div>
        <button type="submit" disabled={loading}>Create User</button>
        {error && <p>{error}</p>}
        {successMessage && <p>{successMessage}</p>}
      </form>
    </div>
  );
};

export default CreateUser;
