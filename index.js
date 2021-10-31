const express = require('express')
const app = express()
const { MongoClient } = require('mongodb');
const ObjectID = require('mongodb').ObjectId;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2uohe.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const port = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.json());

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log("database connected successfully!")
    const usersCollection = client.db(`${process.env.DB_NAME}`).collection("users");

    app.get('/', (req, res) => {
        res.send('Welcome to User Management Server!')
    })

    // add users in server
    app.post('/addUser', (req, res) => {
        const newUser = req.body;
        usersCollection.insertOne(newUser)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    // display all news from server
    app.get('/users', (req, res) => {
        usersCollection.find()
            .toArray((err, users) => {
                res.send(users)
            })
    })
});

app.listen(process.env.PORT || port)