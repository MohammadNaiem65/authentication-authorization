// external imports
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

// connect to mongodb with mongoose
mongoose
	.connect(process.env.MONGODB_CONNECTION_STRING)
	.then(() => console.log('Connected to Database'))
	.catch((err) => console.log(err));

app.get('/', (req, res) => {
	res.json({
		msg: 'Hello World',
	});
});

app.listen(port, (req, res) => {
	console.log(`App in running on ${port}`);
});
