import React, { useState, useEffect } from 'react';
import { useUser } from './userContext'; // Import the useUser hook
import 'bootstrap/dist/css/bootstrap.min.css';

const Transactions = ({ onSwitchView }) => {
    const { userId } = useUser(); // Access the userId from the context
    const [transactions, setTransactions] = useState([]);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState('');
    const [message, setMessage] = useState('');
    const [filteredCategory, setFilteredCategory] = useState('');

    useEffect(() => {
        fetchTransactions();
    }, []); // Fetch transactions on component mount

    const fetchTransactions = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8081/listTransactions/${userId}`);
            if (response.ok) {
                const transactionsData = await response.json();
                console.log("Transactions data:", transactionsData); // Log transactions data
                setTransactions(transactionsData);
            } else {
                setMessage('Error fetching transactions. Please try again later.');
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setMessage('An error occurred. Please try again later.');
        }
    };

    const handleAddTransaction = async () => {
        // Check if amount, description, category, and date are empty
        if (!amount.trim() || !description.trim() || !category.trim() || !date.trim()) {
            setMessage('Please enter amount, description, category, and date.');
            return;
        }
    
        try {
            const response = await fetch(`http://127.0.0.1:8081/createTransaction/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount, description, category, date }),
            });
            if (response.ok) {
                setMessage('Transaction added successfully!');
                // Clear form inputs after successful submission
                setAmount('');
                setDescription('');
                setCategory('');
                setDate('');
                // Fetch updated transactions
                fetchTransactions();
            } else {
                setMessage('Error adding transaction. Please try again later.');
            }
        } catch (error) {
            console.error('Error adding transaction:', error);
            setMessage('An error occurred. Please try again later.');
        }
    };

    const handleDeleteTransaction = async (transactionId) => {
        console.log("Deleting transaction with ID:", transactionId); // Log the transaction ID
        try {
            const response = await fetch(`http://127.0.0.1:8081/deleteTransaction/${userId}/${transactionId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setMessage('Transaction deleted successfully!');
                // Refetch transactions after deletion
                fetchTransactions();
            } else {
                setMessage('Error deleting transaction. Please try again later.');
            }
        } catch (error) {
            console.error('Error deleting transaction:', error);
            setMessage('An error occurred. Please try again later.');
        }
    };

    // Define an array of categories
    const categories = ['Food', 'Utilities', 'Transportation', 'Personal', 'Savings', 'Other'];

    // Function to filter transactions based on category
    const filterTransactions = () => {
        if (filteredCategory === '') {
            return transactions;
        } else {
            return transactions.filter(transaction => transaction.category === filteredCategory);
        }
    };

    return (
        <div className="container">
            <h2>Transactions</h2>
            <div className="row">
                <div className="col-md-6">
                    <h3>Add Transaction</h3>
                    <div className="form-group">
                        <label>Amount:</label>
                        <input
                            type="number" // Change the input type to "number"
                            className="form-control"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Description:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Category:</label>
                        {/* Dropdown for category */}
                        <select
                            className="form-control"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="">Select category</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Date:</label>
                        <input
                            type="date"
                            className="form-control"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-primary" onClick={handleAddTransaction}>Add Transaction</button>
                    {message && <p>{message}</p>}
                </div>
                <div className="col-md-6">
                    <h3>Filter Transactions</h3>
                    <div className="form-group">
                        <label>Filter by Category:</label>
                        <select
                            className="form-control"
                            value={filteredCategory}
                            onChange={(e) => setFilteredCategory(e.target.value)}
                        >
                            <option value="">All</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <h3>Transactions</h3>
                    <ul className="list-group">
                        {filterTransactions().map((transaction) => (
                            <li key={transaction._id} className="list-group-item">
                                <div>
                                    <p>Amount: {transaction.amount}</p>
                                    <p>Description: {transaction.description}</p>
                                    <p>Category: {transaction.category}</p>
                                    <p>Date: {transaction.date}</p>
                                    <button className="btn btn-danger" onClick={() => handleDeleteTransaction(transaction._id)}>Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <button className="btn btn-secondary" onClick={() => onSwitchView('dashboard')}>Back to Dashboard</button>
        </div>
    );
};

export default Transactions;
