import React, { useState, useEffect } from 'react';
import { useUser } from './userContext'; 
import Transactions from './transactions'; 
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = ({ onSwitchView }) => {
  const { userId } = useUser(); 
  const [latestTransactions, setLatestTransactions] = useState([]);
  const [viewMode, setViewMode] = useState('dashboard');
  const [userData, setUserData] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log(`Fetching user data for user ID: ${userId}`);
        const response = await fetch(`http://127.0.0.1:8081/${userId}`);
        console.log(response);
        if (response.ok) {
          console.log("User data retrieved successfully");
          const userData = await response.json();
          console.log("User data:", userData);
          setUserData(userData);
        } else {
          console.error('Error fetching data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const fetchLatestTransactions = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8081/listTransactions/${userId}`);
        if (response.ok) {
          const transactionsData = await response.json();
          setLatestTransactions(transactionsData);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    const fetchBudget = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8081/listBudget/${userId}`);
        if (response.ok) {
          const budgetData = await response.json();
          setBudget(budgetData);
        }
      }
      catch (error) {
        console.log('Error fetching budget');
      }

    };

    fetchUserData(); 
    fetchLatestTransactions();
  }, [userId]); 

  const switchViewMode = (mode) => {
    setViewMode(mode);
    onSwitchView(mode);
  };

  const handleLogout = () => {
    onSwitchView('login');
  };

  return (
  <div className="d-flex flex-column" style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #b5e6b5, #7ec87e)' }}>
    <nav className="navbar navbar-dark bg-success">
      <span className="navbar-brand">Welcome, {userData.name}!</span>
      <div className="d-flex">
        <button className="btn btn-outline-light mr-2" onClick={() => switchViewMode('account-settings')}>
          Account Settings
        </button>
        <button className="btn btn-outline-light" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
    <div className="mt-4"></div>
    {/* Main content */}
    <div className="container-fluid flex-grow-1">
      <div className="row h-100">
        <div className="col-md-6 mb-4">
          {/* Content for the first box */}
          <div className="card h-100" style={{ backgroundColor: '#c8e6c9' }}>
            <div className="card-body">
              <h5 className="card-title">Income</h5>
              <button className="btn btn-success mb-3" onClick={() => switchViewMode('income')}>
                Income
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card h-100" style={{ backgroundColor: '#c8e6c9' }}>
            <div className="card-body">
              <h5 className="card-title">Transactions</h5>
              <button className="btn btn-success mb-3" onClick={() => switchViewMode('transactions')}>
                View All Transactions
              </button>
              <ul className="list-group">
                {latestTransactions.slice(0, 5).map(transaction => (
                  <li key={transaction._id} className="list-group-item" style={{ backgroundColor: '#dcedc8' }}>
                    Amount: {transaction.amount} - Description: {transaction.description} - Category: {transaction.category}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        {viewMode !== 'budgeting' && (
          <div className="col-md-6 mb-4">
            <div className="card h-100" style={{ backgroundColor: '#c8e6c9' }}>
              <div className="card-body">
                <h5 className="card-title">Budgeting Page</h5>
                <button className="btn btn-success" onClick={() => switchViewMode('budgeting')}>
                  Budget
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="col-md-6 mb-4">
          <div className="card h-100" style={{ backgroundColor: '#c8e6c9' }}>
            <div className="card-body">
              <h5 className="card-title">Goals</h5>
              <button className="btn btn-success" onClick={() => switchViewMode('goals')}>
                Goals
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
  
};

export default Dashboard;
