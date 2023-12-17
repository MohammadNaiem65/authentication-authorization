// external imports
const express = require('express');
const mongoose = require('mongoose');
const { initializeApp, cert } = require('firebase-admin/app');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// internal imports
const userHandler = require('./handlers/authHandlers');

// ? TODO: Add your firebase project credentials here
const firebaseCredentials = require('./firebase-credentials.json');

const app = express();
const port = process.env.PORT;

// middlewares
app.use(cors());
app.use(cookieParser(process.env.COOKIE_SECRET));

// initialize firebase app
initializeApp({
	credential: cert(firebaseCredentials),
});

// connect to mongodb with mongoose
mongoose
	.connect(process.env.MONGODB_CONNECTION_STRING)
	.then(() => console.log('Connected to Database'))
	.catch((err) => console.log(err));

app.use('/auth', userHandler);

app.listen(port, (req, res) => {
	console.log(`App in running on ${port}`);
});
