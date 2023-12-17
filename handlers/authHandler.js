// external imports
const express = require('express');



// internal imports
const checkAuth = require('../middlewares/checkAuth');
const { login } = require('../controllers/authController');

const router = express.Router();

router.post('/login', login);

router.post('/log-out', checkAuth, async (req, res) => {
	console.log('hey');
});

module.exports = router;
