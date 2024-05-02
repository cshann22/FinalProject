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

const userCollection = "userCollection";
const transactionCollection = "transactionCollection";
const budgetCollection = "budgetCollection";

var nextUser = 0;

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

//List all users
app.get("/listUsers", async (req, res) => {
    await client.connect();
    console.log("Node connected successfully to GET MongoDB");
    const query = {};
    const results = await db
        .collection(userCollection)
        .find(query)
        .limit(100)
        .toArray();
    console.log(results);
    res.status(200);
    res.send(results);
})


//Get a user by ID
app.get("./:id", async (req, res) => {
    const userId = Number(req.params.id);
    console.log("User to find : ", userId);
    await client.connect();
    console.log("Node connected successfully to GET MongoDB");
    const query = { "id": userId };
    const results = await db.collection(userCollection)
        .findOne(query);
    console.log("Results: ", results);
    if (!results) res.send("User not found").status(404);
    else res.send(results).status(200);
});


app.get("/login", async (req, res) => {
    try {
        // Extract username and password from request query or request body
        const { username, password } = req.query;

        // Connect to the database
        await client.connect();

        // Find the user by username and password in the 'userInfo' collection
        const user = await db
        .collection(userCollection).findOne({ userName: username, password: password });
        if (!user) {
            return res.status(401).send({ message: "Invalid username or password" });
        }
        // User login successful
        res.status(200).send({ message: "Login successful", user: user });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send({ message: "Internal server error" });
    }
});


//Create a user with transponding budget and transactions
app.post("/createUser", async (req, res) => {
    try {
        await client.connect();

        //insert a newUser into 'userCollection'
        const newUser = {
            "id": nextUser++,
            "name": req.body.name,
            "userName": req.body.userName,
            "password": req.body.password
        };
        const result = db
            .collection(userCollection)
        insertOne(newUser);
        console.log(`User create with id: ${result.nextUser}`);

        //Insert empty transaction into 'transactionCollection'
        await transactionCollection.insertOne({
            userId: result.nextUser,
            transactions: []
        });


        //Insert empty budget into 'budgetCollection'
        await budgetCollection.insertOne({
            userId: result.nextUser,
            budget: {
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
        });

        res.send("User created").status(201);
    } catch (error) {
        console.error("An error occurered: ", error);
        res.status(500).send({ error: 'An internal server error occured' });
    }
});


app.put("/updateUser/:id", async (req, res) => {
    const id = Number(req.params.id);
    const query = { id: id };
    try {
        await client.connect();
        console.log("Update user: ", id);
        //Data for updating user, from request body
        console.log(req.body);
        const { name, userName, password } = req.body;
        const updateUser = {
            $set: {}
        };
        if (name !== null) {
            updateUser.$set.name = name;
        }
        if (userName !== null) {
            updateUser.$set.userName = userName;
        }
        if (password !== null) {
            updateUser.$set.password = password;
        }

        const results = await db
            .collection(userCollection)
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
        // Connect to the database
        await client.connect();
        
        // Delete the user from 'userInfo' collection
        await userCollection.deleteOne(query);
        if (userDeleteResult.deletedCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete the associated transaction from 'transactionsCollection'
        await transactionCollection.deleteOne({ userId: id });

        // Delete the associated budget from 'budgetCollection'
        await budgetCollection.deleteOne({ userId: id });

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
        console.log("User to find: ", userId);
        await client.connect();
        console.log("Node connected successfully to GET MongoDB");
        const query = { "userId": userId };
        const user = await db.collection(userCollection)
            .findOne(query);
        if (!user) {
            return res.send("User not found").status(404);
        }
        const userTransactions = await db
            .collection(transactionCollection).find({ userId: userId }).toArray();

        res.send(userTransactions).status(200);
    }
    catch (error) {
        console.log("Error fetching transactions", error);
        res.send("Internal server error").status(500);
    }
});

app.post("/createTransaction/:userId", async (req, res) => {
    const userId = Number(req.params.userId);
    try {
        // Connect to the database
        await client.connect();
        
        // Check if the user exists
        const user = await db
        .collection(userCollection)
        .findOne({ id: userId });
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        // Extract transaction details from the request body
        const { amount, description, category } = req.body;

        // Insert the transaction into 'transactions' collection
        const transactionsCollection = client.db('yourDatabase').collection('transactions');
        await transactionsCollection.insertOne({
            userId: userId,
            amount: amount,
            description: description,
            category : category,
            date: new Date() // You might want to use the actual date from the request
        });

        res.status(201).send({ message: "Transaction created successfully"});
    } catch (error) {
        console.error('Error creating transaction:', error);
        res.status(500).send({ message: "Internal server error" });
    }
});



app.delete("/deleteTransaction/:userId/:transactionId", async (req, res) => {
    const userId = Number(req.params.userId);
    const transactionId = req.params.transactionId;
    try {
        // Connect to the database
        await client.connect();

        // Check if the user exists
        const user = await db
            .collection(userInfoCollection)
            .findOne({ id: userId });
        if (!user) {
            return res.send("User not found").status(404);
        }

        // Delete the transaction from 'transactions' collection
        const deleteResult = await db
            .collection(transactionCollection)
            .deleteOne({ userId: userId, _id: ObjectId(transactionId) });
        if (deleteResult.deletedCount === 0) {
            return res.status(404).send("Transaction not found");
        }
        res.status(200).send("Transaction deleted");
    } catch (error) {
        console.error("Error deleting transaction:", error);
        res.status(500).send({ error: 'An internal server error occurred' });
    }
});


//BUDGET----------------------------------------------------------------------------------------------------------------


app.get("/listBudget/:userId", async (req, res) => {
    const userId = Number(req.params.userId);
    try {
        console.log("User to find: ", userId);
        await client.connect();
        console.log("Node connected successfully to GET MongoDB");
        const query = { "userId": userId };
        const user = await db.collection(userCollection)
            .findOne(query);
        if (!user) {
            return res.send("User not found").status(404);
        }
        const userBudget = await db
            .collection(budgetCollection)
            .find({ userId: userId }).toArray();

        res.send(userTransactions).status(200);
    }
    catch (error) {
        console.log("Error fetching transactions", error);
        res.send("Internal server error").status(500);
    }
});


app.put("/changeBudget/:userId", async (req, res) => {
    const userId = Number(req.params.userId);
    const query = { userId: userId };
    try {
        console.log("User to find: ", userId); 
        await client.connect();
        console.log("Update user budget: ", userId);

        console.log("Node connected successfully to MongoDB");

        // Check if the user exists
        const user = await db
        .collection(userCollection)
        .findOne({ id: userId });
        if (!user) {
            return res.status(404).send("User not found");
        }

        // Extract budget details from request body
        const { total, income, housing, utilities, food, transportation, personal, savings, other } = req.body;

        // Define the update document for the budget
        const updateBudget = {
            $set: {}
        };

        // Add non-null fields to the update document
        if (total !== null) {
            updateBudget.$set.total = total;
        }
        if (income !== null) {
            updateBudget.$set.income = income;
        }
        if (housing !== null) {
            updateBudget.$set.housing = housing;
        }
        if (utilities !== null) {
            updateBudget.$set.utilities = utilities;
        }
        if (food !== null) {
            updateBudget.$set.food = food;
        }
        if (transportation !== null) {
            updateBudget.$set.transportation = transportation;
        }
        if (personal !== null) {
            updateBudget.$set.personal = personal;
        }
        if (savings !== null) {
            updateBudget.$set.savings = savings;
        }
        if (other !== null) {
            updateBudget.$set.other = other;
        }

        // Update the budget for the user
        const result = await db
        .collection(budgetCollection).updateOne(query, updateBudget);

        res.send("Budget updated successfully").status(200);
    } catch (error) {
        console.error("Error updating budget:", error);
        res.send("Internal server error").status(500);
    }
});


