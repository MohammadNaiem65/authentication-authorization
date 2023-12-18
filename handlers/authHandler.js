// external imports
const express = require('express');

// internal imports
const checkAuth = require('../middlewares/checkAuth');
const { login, logout } = require('../controllers/authController');

const router = express.Router();

router.post('/login', login);

router.post('/logout', checkAuth, logout);

module.exports = router;
