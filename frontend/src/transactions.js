import React, { useState, useEffect } from 'react';
import { useUser } from './userContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const Transactions = ({ onSwitchView }) => {
    const { userId } = useUser();
    const [transactions, setTransactions] = useState([]);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState('');
    const [message, setMessage] = useState('');
    const [filteredCategory, setFilteredCategory] = useState('');

    const categories = ['Food', 'Utilities', 'Transportation', 'Personal', 'Savings', 'Other'];

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            console.log(`User id : ${userId} --`)
            const response = await fetch(`http://127.0.0.1:8081/listTransactions/${userId}`);
            if (response.ok) {
                const transactionsData = await response.json();
                console.log("Transactions data:", transactionsData);
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
        if (!amount.trim() || !description.trim() || !category.trim() || !date.trim()) {
            setMessage('Enter amount, description, category, and date.');
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
                setAmount('');
                setDescription('');
                setCategory('');
                setDate('');
                fetchTransactions();
            } else {
                setMessage('Error adding transaction.');
            }
        } catch (error) {
            console.error('Error adding transaction:', error);
            setMessage('An error occurred.');
        }
    };

    const handleDeleteTransaction = async (transactionId) => {
        console.log("Deleting transaction with ID:", transactionId);
        try {
            const response = await fetch(`http://127.0.0.1:8081/deleteTransaction/${userId}/${transactionId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setMessage('Transaction deleted successfully!');
                fetchTransactions();
            } else {
                setMessage('Error deleting transaction.');
            }
        } catch (error) {
            console.error('Error deleting transaction:', error);
            setMessage('An error occurred.');
        }
    };



    const filterTransactions = () => {
        if (filteredCategory === '') {
            return transactions;
        } else {
            return transactions.filter(transaction => transaction.category === filteredCategory);
        }
    };

    return (
        <div className="container" style={{ background: 'linear-gradient(to bottom, #b5e6b5, #7ec87e)', minHeight: '100vh' }}>
            <h2 style={{ color: '#003300' }}>Transactions</h2>
            <div className="row">
                <div className="col-md-6">
                    <h3>Add Transaction</h3>
                    <div className="form-group">
                        <label style={{ color: '#003300' }}>Amount:</label>
                        <input
                            type="number"
                            className="form-control"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ color: '#003300' }}>Description:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ color: '#003300' }}>Category:</label>
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
                        <label style={{ color: '#003300' }}>Date:</label>
                        <input
                            type="date"
                            className="form-control"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-success" onClick={handleAddTransaction}>Add Transaction</button>
                    {message && <p style={{ color: '#003300' }}>{message}</p>}
                </div>
                <div className="col-md-6">
                    <h3 style={{ color: '#003300' }}>Filter Transactions</h3>
                    <div className="form-group">
                        <label style={{ color: '#003300' }}>Filter by Category:</label>
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
                    <h3 style={{ color: '#003300' }}>Transactions</h3>
                    <ul className="list-group">
                        {filterTransactions().map((transaction) => (
                            <li key={transaction._id} className="list-group-item" style={{ backgroundColor: '#dcedc8' }}>
                                <div>
                                    <p style={{ color: '#003300' }}>Amount: {transaction.amount}</p>
                                    <p style={{ color: '#003300' }}>Description: {transaction.description}</p>
                                    <p style={{ color: '#003300' }}>Category: {transaction.category}</p>
                                    <p style={{ color: '#003300' }}>Date: {transaction.date}</p>
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
