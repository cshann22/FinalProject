import React, { useState, useEffect } from 'react';
import { useUser } from './userContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const IncomePage = ({ onSwitchView }) => {
    const { userId } = useUser();
    const [income, setIncome] = useState(0);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchIncome();
    }, [userId]);

    const fetchIncome = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8081/getIncome/${userId}`);
            if (response.ok) {
                const incomeData = await response.json();
                console.log("Income data:", incomeData);
                setIncome(incomeData);
            } else {
                setMessage('Error fetching income data.');
            }
        } catch (error) {
            console.error('Error fetching income data:', error);
            setMessage('An error occurred.');
        }
    };

    const handleIncomeUpdate = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8081/updateIncome/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ income }),
            });
            if (response.ok) {
                setMessage('Income updated successfully!');
            } else {
                setMessage('Error updating income.');
            }
        } catch (error) {
            console.error('Error updating income:', error);
            setMessage('An error occurred.');
        }
    };

    return (
        <div className="container">
            <h2>Income Tracking</h2>
            <div className="row">
                <div className="col-md-6">
                    <h3>Current Income</h3>
                    <form>
                        <div className="form-group">
                            <label>Income:</label>
                            <input
                                type="number"
                                className="form-control"
                                value={income}
                                onChange={(e) => setIncome(parseFloat(e.target.value))}
                            />
                        </div>
                        <button type="button" className="btn btn-success" onClick={handleIncomeUpdate}>Update Income</button>
                        {message && <p>{message}</p>}
                        <button className="btn btn-secondary" onClick={() => onSwitchView('dashboard')}>Back to Dashboard</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default IncomePage;
