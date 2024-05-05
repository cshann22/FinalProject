import React, { useState, useEffect } from 'react';
import { useUser } from './userContext'; // Import the useUser hook
import Transactions from './transactions'; // Import the Transactions component
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = ({ onSwitchView }) => {
  const { userId } = useUser(); // Access the userId from the context
  const [username, setUsername] = useState(''); // Initialize with 'Guest' as default
  const [latestTransactions, setLatestTransactions] = useState([]);
  const [viewMode, setViewMode] = useState('dashboard'); // State to manage view mode

  useEffect(() => {
    // Function to fetch user data based on userId
    const fetchUserData = async () => {
      try {
        if (userId) {
          const response = await fetch(`http://127.0.0.1/${userId}`); // Adjust the URL based on your backend API
          if (response.ok) {
            const userData = await response.json();
            setUsername(userData.username); // Set the username obtained from the server
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    // Function to fetch the latest 5 transactions
    const fetchLatestTransactions = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8081/latestTransactions/${userId}`);
        if (response.ok) {
          const transactionsData = await response.json();
          setLatestTransactions(transactionsData);
        }
      } catch (error) {
        console.error('Error fetching latest transactions:', error);
      }
    };

    fetchUserData(); // Call the fetchUserData function when userId changes
    fetchLatestTransactions(); // Fetch latest transactions
  }, [userId]); // useEffect dependency on userId

  // Function to switch view mode
  const switchViewMode = (mode) => {
    setViewMode(mode);
    onSwitchView(mode);
  };

  const handleLogout = () => {
    // Handle logout logic here
    // For example, clear user data from context and navigate to the login page
    // You can use onSwitchView to navigate to the login page
    onSwitchView('login');
  };

  return (
    <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
      {/* Navigation bar */}
      <nav className="navbar navbar-dark bg-dark">
        {/* Left side: User's username */}
        <span className="navbar-brand">Welcome, {username}!</span>
        {/* Right side: Buttons for Account Settings, Transactions, and Logout */}
        <div className="d-flex">
          <button className="btn btn-outline-light mr-2" onClick={() => switchViewMode('account-settings')}>
            Account Settings
          </button> 
          <button className="btn btn-outline-light" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Main content */}
      <div className="container-fluid flex-grow-1">
        <div className="row h-100">
          <div className="col-md-6 mb-4">
            {/* Content for the first box */}
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">Box 1</h5>
                <p className="card-text">Content for Box 1 goes here.</p>
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-4">
            {/* Content for the second box */}
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">Transactions</h5>
                {/* Button to view all transactions */}
                <button className="btn btn-primary mb-3" onClick={() => switchViewMode('transactions')}>
                  Transactions
                </button>
                {/* Display the latest 5 transactions */}
                <ul className="list-group">
                  {latestTransactions.slice(0, 5).map(transaction => (
                    <li key={transaction._id} className="list-group-item">
                      Amount: {transaction.amount}, Description: {transaction.description}, Category: {transaction.category}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          {/* Display the third box with Budgeting button only when viewMode is not 'budgeting' */}
          {viewMode !== 'budgeting' && (
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">Budgeting Page</h5>
                  {/* Button to switch to budgeting view */}
                  <button className="btn btn-primary" onClick={() => switchViewMode('budgeting')}>
                    Budget
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="col-md-6 mb-4">
            {/* Content for the fourth box */}
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">Box 4</h5>
                <p className="card-text">Content for Box 4 goes here.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
