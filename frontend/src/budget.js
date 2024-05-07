import React, { useState, useEffect } from 'react';
import { useUser } from './userContext'; // Import the useUser hook
import 'bootstrap/dist/css/bootstrap.min.css';



const BudgetingPage = ({ onSwitchView }) => {
    const { userId } = useUser(); // Access the userId from the context
    const [budget, setBudget] = useState({
        total: 0,
        income: 0,
        housing: 0,
        utilities: 0,
        food: 0,
        transportation: 0,
        personal: 0,
        savings: 0,
        other: 0
    });
    const [message, setMessage] = useState('');
    const [oldBudget, setOldBudget] = useState(null);
    const [tempIncome, setTempIncome] = useState('');
    // Calculate total dynamically based on other fields
    function calculateTotal(){
        const total = Object.values(budget)
            .filter((key) => key !== budget.total && key !== budget.income) // Exclude 'total' and 'income'
            .reduce((amount, value) => amount + parseFloat(value), 0); // Initial value set to 0
        return total;
    };
    
    const calculateRemainingBalance = () => {
        const expenses = Object.values(budget)
        .filter((key) => key !== budget.total && key !== budget.income)
        .reduce((total, value) => total + parseFloat(value), 0);
        return budget.income - expenses;
    };

    useEffect(() => {
        // Fetch budget data on component mount and when userId changes
        fetchBudget();
    }, [userId]);


    
    const fetchBudget = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8081/listBudget/${userId}`);
            if (response.ok) {
                const budgetData = await response.json();
                console.log("Budget data:", budgetData);
                setBudget(budgetData);
                setOldBudget(budgetData);
                setTempIncome(budgetData.income);
            } else {
                setMessage('Error fetching budget data. Please try again later.');
            }
        } catch (error) {
            console.error('Error fetching budget data:', error);
            setMessage('An error occurred. Please try again later.');
        }
    };

    const handleBudgetUpdate = async () => {
        try {
            var total = calculateTotal();
            total = 0;
            setTempIncome(calculateRemainingBalance());
            //const updatedBudget = { ...budget, total};
            const response = await fetch(`http://127.0.0.1:8081/changeBudget/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(budget),
            });
            if (response.ok) {
                setMessage('Budget updated successfully!');
            } else {
                setMessage('Error updating budget. Please try again later.');
            }
        } catch (error) {
            console.error('Error updating budget:', error);
            setMessage('An error occurred. Please try again later.');
        }
    };

    // Handler function to update budget state
    const handleBudgetChange = (e) => {
        const { name, value } = e.target;
        setBudget(prevBudget => ({
            ...prevBudget,
            [name]: parseFloat(value) || 0 // Ensure value is a number
        }));
    };

    return (
        <div className="container">
            <h2>Budgeting</h2>
            <div className="row">
                <div className="col-md-6">
                    <h3>Current Budget</h3>
                    <form>
                    <div className="form-group">
                            <label>Income:</label>
                            <input
                                type="text"
                                className="form-control"
                                name="income"
                                value={tempIncome}
                                disabled
                            />
                        </div>
                        <div className="form-group">
                            <label>Housing:</label>
                            <input
                                type="number"
                                className="form-control"
                                name="housing"
                                value={budget.housing}
                                onChange={handleBudgetChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Utilities:</label>
                            <input
                                type="number"
                                className="form-control"
                                name="utilities"
                                value={budget.utilities}
                                onChange={handleBudgetChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Food:</label>
                            <input
                                type="number"
                                className="form-control"
                                name="food"
                                value={budget.food}
                                onChange={handleBudgetChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Transportation:</label>
                            <input
                                type="number"
                                className="form-control"
                                name="transportation"
                                value={budget.transportation}
                                onChange={handleBudgetChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Personal:</label>
                            <input
                                type="number"
                                className="form-control"
                                name="personal"
                                value={budget.personal}
                                onChange={handleBudgetChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Savings:</label>
                            <input
                                type="number"
                                className="form-control"
                                name="savings"
                                value={budget.savings}
                                onChange={handleBudgetChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Other:</label>
                            <input
                                type="number"
                                className="form-control"
                                name="other"
                                value={budget.other}
                                onChange={handleBudgetChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Total:</label>
                            <input
                                type="text"
                                className="form-control"
                                name="total"
                                placeholder='0'
                                value={calculateTotal()}
                                disabled
                            />
                        </div>
                        <button type="button" className="btn btn-success" onClick={handleBudgetUpdate}>Update Budget</button>
                        {message && <p>{message}</p>}
                        <button className="btn btn-secondary" onClick={() => onSwitchView('dashboard')}>Back to Dashboard</button>
                    </form>
                </div>
            </div>
        </div>
    );
};




export default BudgetingPage;
