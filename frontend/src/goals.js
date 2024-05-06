import React, { useState, useEffect } from 'react';
import { useUser } from './userContext'; // Import the useUser hook
import 'bootstrap/dist/css/bootstrap.min.css';

const GoalsPage = ({ onSwitchView }) => {
    const { userId } = useUser(); // Access the userId from the context
    const [goals, setGoals] = useState([]);
    const [newGoal, setNewGoal] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Fetch goals data on component mount and when userId changes
        fetchGoals();
    }, [userId]);

    const fetchGoals = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8081/getGoals/${userId}`);
            if (response.ok) {
                const goalsData = await response.json();
                console.log("Goals data:", goalsData);
                setGoals(goalsData);
            } else {
                setMessage('Error fetching goals data. Please try again later.');
            }
        } catch (error) {
            console.error('Error fetching goals data:', error);
            setMessage('An error occurred. Please try again later.');
        }
    };

    const handleAddGoal = async () => {
        if (!newGoal.trim()) {
            setMessage('Please enter a goal.');
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8081/addGoal/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ goal: newGoal }),
            });
            if (response.ok) {
                setMessage('Goal added successfully!');
                setNewGoal('');
                fetchGoals();
            } else {
                setMessage('Error adding goal. Please try again later.');
            }
        } catch (error) {
            console.error('Error adding goal:', error);
            setMessage('An error occurred. Please try again later.');
        }
    };

    const handleDeleteGoal = async (goalId) => {
        try {
            const response = await fetch(`http://127.0.0.1:8081/deleteGoal/${userId}/${goalId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setMessage('Goal deleted successfully!');
                fetchGoals();
            } else {
                setMessage('Error deleting goal. Please try again later.');
            }
        } catch (error) {
            console.error('Error deleting goal:', error);
            setMessage('An error occurred. Please try again later.');
        }
    };

    return (
        <div className="container">
            <h2>Goals Tracking</h2>
            <div className="row">
                <div className="col-md-6">
                    <h3>Add New Goal</h3>
                    <div className="form-group">
                        <label>Goal:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={newGoal}
                            onChange={(e) => setNewGoal(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-primary" onClick={handleAddGoal}>Add Goal</button>
                    {message && <p>{message}</p>}
                </div>
                <div className="col-md-6">
                    <h3>Current Goals</h3>
                    <ul className="list-group">
                        {goals.map((goal) => (
                            <li key={goal._id} className="list-group-item">
                                {goal.goal}
                                <button className="btn btn-danger" onClick={() => handleDeleteGoal(goal._id)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <button className="btn btn-secondary" onClick={() => onSwitchView('dashboard')}>Back to Dashboard</button>
        </div>
    );
};

export default GoalsPage;
