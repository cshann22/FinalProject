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