const express = require('express');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.get('/', (req, res) => {
	res.json({
		msg: 'Hello World',
	});
});

app.listen(port, (req, res) => {
	console.log(`App in running on ${port}`);
});
