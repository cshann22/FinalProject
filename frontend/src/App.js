import React, { useState } from 'react';
import './App.css';
import Login from './login';
import CreateUser from './createUser';
import Dashboard from './dashboard';

const App = () => {
  const [view, setView] = useState('login'); // State to track which view to display

  const handleSwitchView = (newView) => {
    setView(newView);
  };

  return (
    <div className="app">
      {view === 'login' && (
        <div>
          <Login />
          <button onClick={() => handleSwitchView('createUser')}>Create Account</button>
        </div>
      )}
      {view === 'createUser' && (
        <div>
          <CreateUser />
          <button onClick={() => handleSwitchView('login')}>Back to Login</button>
        </div>
      )}
      {view === 'dashboard' && <Dashboard />}
    </div>
  );
};

export default App;
