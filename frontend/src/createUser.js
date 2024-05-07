import React, { useState } from 'react';

const CreateUser = ({ handleSwitchView }) => {
  const [userFormData, setUserFormData] = useState({
    name: "",
    userName: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    setUserFormData({ ...userFormData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      // Check if the username already exists
      const checkResponse = await fetch('http://127.0.0.1:8081/checkUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userName: userFormData.userName })
      });

      if (!checkResponse.ok) {
        throw new Error('User check failed');
      }

      const checkData = await checkResponse.json();

      if (checkData.exists) {
        setError('An account with that username already exists.');
        setLoading(false);
        return;
      }

      // If the username doesn't exist, proceed with user creation
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
      setUserFormData({
        name: "",
        userName: "",
        password: ""
      });
      setSuccessMessage('User created successfully!');
    } catch (error) {
      console.error('Error creating user:', error);
      setError('An error occurred while creating the user.');
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="login-box p-4 border rounded">
        <h2>Create User</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name:</label>
            <input type="text" className="form-control" id="name" name="name" placeholder="Name" value={userFormData.name} onChange={handleInputChange} />
          </div>
          <div className="mb-3">
            <label htmlFor="userName" className="form-label">Username:</label>
            <input type="text" className="form-control" id="userName" name="userName" placeholder="Username" value={userFormData.userName} onChange={handleInputChange} />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password:</label>
            <input type="password" className="form-control" id="password" name="password" placeholder="Password" value={userFormData.password} onChange={handleInputChange} />
          </div>
          <button type="submit" className="btn btn-success" disabled={loading}>Create User</button>
          {error && <p>{error}</p>}
          {successMessage && <p>{successMessage}</p>}
        </form>
        <div className="d-flex justify-content-between mt-3">
          <button className="btn btn-outline-success" onClick={() => handleSwitchView('login')}>Back to Login</button>
        </div>
      </div>
    </div>
  );
};


export default CreateUser;
