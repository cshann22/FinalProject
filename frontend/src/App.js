
import React, { useState } from 'react';
import Login from './login';
import CreateUser from './createUser';
import Dashboard from './dashboard';
import AccountSettings from './accountSettings';
import Transactions from './transactions';
import BudgetingPage from './budget';
import IncomePage from './income';
import GoalsPage from './goals';
import { UserProvider } from './userContext';

const App = () => {
  const [view, setView] = useState('login');

  const handleSwitchView = (newView) => {
    setView(newView);
  };

  return (
    <UserProvider>
      <div className="app" style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #b5e6b5, #7ec87e)' }}>
        {view === 'login' && (
          <div className="container-fluid d-flex justify-content-center align-items-center">
            <Login onLogin={() => handleSwitchView('dashboard')} handleSwitchView={handleSwitchView} />
          </div>
        )}
        {view === 'createUser' && (
          <div className="container-fluid d-flex justify-content-center align-items-center">
            <CreateUser handleSwitchView={handleSwitchView} />
          </div>
        )}

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
