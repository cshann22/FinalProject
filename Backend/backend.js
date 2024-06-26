const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
var app = express();
const { MongoClient, ObjectId } = require("mongodb");


app.use(cors());
app.use(bodyParser.json());

const url = "mongodb://localhost:27017";
const dbName = "budgetApp";
const client = new MongoClient(url);
const db = client.db(dbName);

const userCollection = db.collection("userCollection");


var lastUserId = 0;

client.connect((err) => {
    if (err) {
        console.error("Error connecting to MongoDB:", err);
        return;
    }
    console.log("Connection to MongoDB");
    db = client.db(dbName);
});

app.use(cors());
app.use(bodyParser.json());

const port = 8081;
const host = "localhost";

app.listen(port, () => {
    console.log(`App listening at http://${host}:${port}`);
});


//USERS----------------------------------------------------------------------------------------------------------------

app.get("/listUsers", async (req, res) => {
    await client.connect();
    console.log("Node connected successfully to GET MongoDB");
    const query = {};
    const results = await userCollection
        .find(query)
        .limit(100)
        .toArray();
    console.log(results);
    res.status(200);
    res.send(results);
})

app.get("/:id", async (req, res) => {
    const userId = Number(req.params.id);
    const query = { id : userId };
    console.log("User to find  ", userId);
    await client.connect();
    console.log("Node connected successfully to GET MongoDB");
    const results = await userCollection
        .findOne(query);
    console.log("Results: ------- ", results);
    if (!results) res.send("User not found").status(404);
    else res.send(results).status(200);
});

app.post("/login", async (req, res) => {
    try {
        const loginUser = {
            "userName": req.body.userName,
            "password": req.body.password
        };
        await client.connect();
        console.log("Node connected successfully to MongoDB");

        const user = await userCollection.findOne({ userName: loginUser.userName });
        if (!user) {
            // User not found
            return res.status(401).send({ message: "Invalid username or password" });
        }
        console.log(`User found: ${user.userName}`);

        if (user.password !== loginUser.password) {
            // Passwords don't match
            return res.status(401).send({ message: "Invalid username or password" });
        }
        console.log("User logged in:", user);
        res.status(201).send({ message: "Login successful", user: user });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send({ message: "Internal server error" });
    }
});

app.post("/createUser", async (req, res) => {
    try {
        await client.connect();

        const checkUser = await userCollection
            .findOne({ userName: req.body.userName });
        if (checkUser) {
            console.log(`User ${checkUser.userName} already exists`);
            return res.status(401).send({ message: "There is already an account with that username" });
        }

        lastUserId++;

        const newUser = {
            "id": lastUserId,
            "name": req.body.name,
            "userName": req.body.userName,
            "password": req.body.password
        };
        const result = await userCollection
            .insertOne(newUser);
        console.log(`User create with id: ${newUser.id}`);

        const newBudget = {
            total: 0,
            income: 0,
            housing: 0,
            utilites: 0,
            food: 0,
            transportation: 0,
            personal: 0,
            savings: 0,
            other: 0
        }

        await userCollection.updateOne({id : newUser.id}, { $set: { budget: newBudget}});

        res.send("User created").status(201);
    } catch (error) {
        console.error("An error occurered: ", error);
        res.status(500).send({ error: 'An internal server error occured' });
    }
});

app.post("/checkUser", async (req, res) => {
    try {
        await client.connect();

        const checkUser = await userCollection.findOne({ userName: req.body.userName });

        if (checkUser) {
            console.log(`User ${checkUser.userName} already exists`);
            return res.status(200).send({ exists: true });
        }

        console.log(`User ${req.body.userName} does not exist`);
        return res.status(200).send({ exists: false });
    } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).send({ error: 'An internal server error occurred' });
    }
});

app.put("/updateUser/:id", async (req, res) => {
    const id = Number(req.params.id);
    const query = { id: id };
    try {
        await client.connect();
        console.log("Update user: ", id);
        console.log(req.body);
        const { name, userName, password } = req.body;
        const updateUser = {
            $set: {}
        };
        if (name !== null && name !== undefined) {
            updateUser.$set.name = name;
        }
        if (userName !== null && userName !== undefined) {
            updateUser.$set.userName = userName;
        } else {
            updateUser.$set.userName = user.UserName
        }
        if (password !== null && password !== undefined) {
            updateUser.$set.password = password;
        }

        const results = await userCollection
            .updateOne(query, updateUser);

        res.send(results).status(200);
    } catch (error) {
        console.error("Error updating user: ", error);
        res.status(500).send({ error: 'An internal server error occured' });
    }
});

app.delete("/deleteUser/:id", async (req, res) => {
    const id = Number(req.params.id);
    const query = { id: id };
    try {
        await client.connect();

        await userCollection.deleteOne(query);
        if (userDeleteResult.deletedCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User and associated data deleted successfully' });
    } catch (error) {
        console.error('Error deleting user and associated data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


//TRANSACTIONS----------------------------------------------------------------------------------------------------------------


app.get("/listTransactions/:userId", async (req, res) => {
    const userId = Number(req.params.userId);
    try {
        await client.connect();

        const user = await userCollection.findOne({ id: userId });
        if (!user) {
            return res.status(404).send("User not found");
        }

        const userTransactions = user.transactions || [];

        res.status(200).send(userTransactions);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).send("Internal server error");
    }
});

app.post("/createTransaction/:userId", async (req, res) => {
    const userId = Number(req.params.userId);
    try {
        await client.connect();

        const { amount, description, category, date } = req.body;

        const user = await userCollection.findOne({ id: userId });

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        const updatedTransactions = user.transactions || [];
        updatedTransactions.push({
            amount: amount,
            description: description,
            category: category,
            date: date
        });

        await userCollection.updateOne({ id: userId }, { $set: { transactions: updatedTransactions } });

        res.status(201).send({ message: "Transaction added successfully" });
    } catch (error) {
        console.error('Error adding transaction:', error);
        res.status(500).send({ message: "Internal server error" });
    }
});

app.delete("/deleteTransaction/:userId/:transactionId", async (req, res) => {
    const userId = Number(req.params.userId);
    const transactionId = Number(req.params.transactionId);
    try {
        await client.connect();

        const user = await userCollection.findOne({ id: userId });

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        const updatedTransactions = user.transactions || [];

        if (transactionId < 0 || transactionId >= updatedTransactions.length) {
            return res.status(400).send({ message: 'Invalid id' });
        }

        updatedTransactions.splice(transactionId, 1);

        await userCollection.updateOne({ id: userId }, { $set: { transactions: updatedTransactions } });

        res.status(200).send({ message: "Transaction deleted successfully" });
    } catch (error) {
        console.error('Error deleting transaction:', error);
        res.status(500).send({ message: "Internal server error" });
    }
});


//BUDGET----------------------------------------------------------------------------------------------------------------


app.get("/listBudget/:userId", async (req, res) => {
    const userId = Number(req.params.userId);
    const query = { id: userId };
    try {
        console.log("User to find: ", userId);
        await client.connect();
        console.log("Finding user budget: ", userId);

        console.log("Node connected successfully to MongoDB");

        const user = await userCollection.findOne({ id: userId });
        if (!user) {
            return res.status(404).send("User not found");
        }

        const { budget } = user;

        res.status(200).json(budget);
    } catch (error) {
        console.error("Error fetching budget:", error);
        res.status(500).send("Internal server error");
    }
});




app.put("/changeBudget/:userId", async (req, res) => {
    const userId = Number(req.params.userId);
    const query = { id: userId };
    try {
        console.log("User to find: ", userId);
        await client.connect();
        console.log("Update user budget: ", userId);

        console.log("Node connected successfully to MongoDB");

        const user = await userCollection
            .findOne({ id: userId });
        if (!user) {
            return res.status(404).send("User not found");
        }

        const { total, income, housing, utilities, food, transportation, personal, savings, other } = req.body;

        const updateBudget = {
            $set: {
                budget:{
                    total: total !== undefined ? total : user.budget.total,
                    income: income !== undefined ? income : user.budget.income,
                    housing: housing !== undefined ? housing : user.budget.housing,
                    utilities: utilities !== undefined ? utilities : user.budget.utilities,
                    food: food !== undefined ? food : user.budget.food,
                    transportation: transportation !== undefined ? transportation : user.budget.transportation,
                    personal: personal !== undefined ? personal : user.budget.personal,
                    savings: savings !== undefined ? savings : user.budget.savings,
                    other: other !== undefined ? other : user.budget.other
                }
            }
        }

        const result = await userCollection
            .updateOne(query, updateBudget);

        res.send("Budget updated successfully").status(200);
    } catch (error) {
        console.error("Error updating budget:", error);
        res.send("Internal server error").status(500);
    }
});

//GOALS----------------------------------------------------------------------------------------------------------------

app.get("/getGoals/:userId", async (req, res) => {
    const userId = Number(req.params.userId);
    try {
        await client.connect();

        const user = await userCollection.findOne({ id: userId });
        if (!user) {
            return res.status(404).send("User not found");
        }

        const userGoals = user.goals || [];

        res.status(200).send(userGoals);
    } catch (error) {
        console.error("Error fetching goals:", error);
        res.status(500).send("Internal server error");
    }
});

app.post("/addGoal/:userId", async (req, res) => {
    const userId = Number(req.params.userId);
    try {
        await client.connect();

        const { goal } = req.body;

        const user = await userCollection.findOne({ id: userId });

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        const updatedGoals = user.goals || [];
        updatedGoals.push({
            goal: goal
        });

        await userCollection.updateOne({ id: userId }, { $set: { goals: updatedGoals } });

        res.status(201).send({ message: "Goal added successfully" });
    } catch (error) {
        console.error('Error adding goal:', error);
        res.status(500).send({ message: "Internal server error" });
    }
});

app.delete("/deleteGoal/:userId/:goalId", async (req, res) => {
    const userId = Number(req.params.userId);
    const goalId = Number(req.params.goalId);
    try {
        await client.connect();

        const user = await userCollection.findOne({ id: userId });

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        const updatedGoals = user.goals || [];

        if (goalId < 0 || goalId >= updatedGoals.length) {
            return res.status(400).send({ message: 'Invalid id' });
        }

        updatedGoals.splice(goalId, 1);
        await userCollection.updateOne({ id: userId }, { $set: { goals: updatedGoals } });

        res.status(200).send({ message: "Goal deleted successfully" });
    } catch (error) {
        console.error('Error deleting goal:', error);
        res.status(500).send({ message: "Internal server error" });
    }
});


//INCOME----------------------------------------------------------------------------------------------------------------


app.get("/getIncome/:userId", async (req, res) => {
    const userId = Number(req.params.userId);
    try {
        await client.connect();

        const user = await userCollection.findOne({ id: userId });
        if (!user) {
            return res.status(404).send("User not found");
        }

        const userIncome = user.income || 0;

        res.status(200).send(userIncome.toString());
    } catch (error) {
        console.error("Error fetching income:", error);
        res.status(500).send("Internal server error");
    }
});

app.put("/updateIncome/:userId", async (req, res) => {
    const userId = Number(req.params.userId);
    const query = { id: userId };
    try {
        console.log("User to find: ", userId);
        await client.connect();
        console.log("Update user budget: ", userId);
        console.log("Node connected successfully to MongoDB");

        const user = await userCollection.findOne({ id: userId });
        if (!user) {
            return res.status(404).send("User not found");
        }
        const { income } = req.body;

        const updateBudget = {
            $set: {
                "budget.income": income !== undefined ? income : user.budget.income
            }
        };

        const result = await userCollection.updateOne(query, updateBudget);

        res.send("Budget updated successfully").status(200);
    } catch (error) {
        console.error("Error updating budget:", error);
        res.send("Internal server error").status(500);
    }
});
