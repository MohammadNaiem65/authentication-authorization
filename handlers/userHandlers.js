const express = require('express');

const router = express.Router();

// create user
router.post('/', async (req, res) => {
	const authHeader = req.headers.authorization;
	const token = authHeader && authHeader.split(' ')[1];

	// send unauthorized status
	if (!token) return res.sendStatus(401);

	console.log(token);
});

module.exports = router;
