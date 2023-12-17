// external imports
const express = require('express');
const mongoose = require('mongoose');
const { initializeApp, cert } = require('firebase-admin/app');
const cors = require('cors');
require('dotenv').config();

// internal imports
const userHandler = require('./handlers/userHandlers');

// ? TODO: Add your firebase project credentials here
const firebaseCredentials = require('./firebase-credentials.json');

const app = express();
const port = process.env.PORT;

// middlewares
app.use(cors());

// initialize firebase app
initializeApp({
	credential: cert(firebaseCredentials),
});

// connect to mongodb with mongoose
mongoose
	.connect(process.env.MONGODB_CONNECTION_STRING)
	.then(() => console.log('Connected to Database'))
	.catch((err) => console.log(err));

app.use('/users', userHandler);

app.listen(port, (req, res) => {
	console.log(`App in running on ${port}`);
});
