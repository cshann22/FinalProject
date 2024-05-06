// App.js
import React, { useState } from 'react';
import './App.css';
import Login from './login';
import CreateUser from './createUser';
import Dashboard from './dashboard';
import AccountSettings from './accountSettings'; // Import AccountSettings component
import Transactions from './transactions'; // Import Transactions component
import BudgetingPage from './budget'; // Import BudgetingPage component
import IncomePage from './income';
import GoalsPage from './goals';
import { UserProvider } from './userContext'; // Import the UserProvider

const App = () => {
  const [view, setView] = useState('login'); // State to track which view to display

  const handleSwitchView = (newView) => {
    setView(newView);
  };

  return (
    <UserProvider>
      <div className="app">
        {view === 'login' && (
          <div className="container-fluid d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div>
              <Login onLogin={() => handleSwitchView('dashboard')} handleSwitchView={handleSwitchView} />

            </div>
          </div>
        )}
        {view === 'createUser' && (
          <div className="container-fluid d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div>
              <CreateUser handleSwitchView={handleSwitchView} />
              <button className="btn btn-outline-primary" onClick={() => handleSwitchView('login')}>Back to Login</button>
            </div>
          </div>
        )}

        {/* Render Dashboard or AccountSettings based on the view */}
        {view === 'dashboard' && (
          <Dashboard onSwitchView={handleSwitchView} />
        )}
        {view === 'account-settings' && (
          <AccountSettings onSwitchView={handleSwitchView} />
        )}
        {view === 'transactions' && (
          <Transactions onSwitchView={handleSwitchView} />
        )}
        {view === 'budgeting' && (
          <BudgetingPage onSwitchView={handleSwitchView} />
        )}
        {view === 'income' && (
  <IncomePage onSwitchView={handleSwitchView} />
)}
        {view === 'goals' && (
  <GoalsPage onSwitchView={handleSwitchView} />
)}
      </div>
    </UserProvider>
  );
};

export default App;
