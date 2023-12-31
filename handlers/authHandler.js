// external imports
const express = require('express');

// internal imports
const checkAuth = require('../middlewares/checkAuth');
const {
	login,
	logout,
	generateToken,
	authenticate,
} = require('../controllers/authController');

const router = express.Router();

router.post('/login', authenticate);

router.post('/logout', checkAuth, logout);

router.post('/refresh', checkAuth, generateToken);

module.exports = router;

// My Expired token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1kcmF0YWhtZWRuYWllbUBnbWFpbC5jb20iLCJfaWQiOiI2NTdmMDZjODgxNzVjYmE3NjFjNjU3YTUiLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTcwMjgyMzYyNCwiZXhwIjoxNzAyODI3MjI0fQ.2F-JUELggLOJ2iSQeZxk9_jKzHQ20_XOfl94Kozy06w

// Firebase Expired token: eyJhbGciOiJSUzI1NiIsImtpZCI6ImJlNzgyM2VmMDFiZDRkMmI5NjI3NDE2NThkMjA4MDdlZmVlNmRlNWMiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiTUQgUklGQVQiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jTEpnSDFtTFBsRlF5MEViaDBvOFpSaTMxdURaRnF5OW1IZ3ZXU2R6V3hHUHA0PXM5Ni1jIiwiX2lkIjoiNjU4MTRiM2Y5MzRlOTY4YzQ5OGE5OTBlIiwicm9sZSI6InN0dWRlbnQiLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vY2hhdC00MDY1NSIsImF1ZCI6ImNoYXQtNDA2NTUiLCJhdXRoX3RpbWUiOjE3MDI5NzQxMTcsInVzZXJfaWQiOiI3M3o2eUhrVGt1WGExT251SzNLbmhIZE11b2kxIiwic3ViIjoiNzN6NnlIa1RrdVhhMU9udUszS25oSGRNdW9pMSIsImlhdCI6MTcwMjk3NDExNywiZXhwIjoxNzAyOTc3NzE3LCJlbWFpbCI6Im1kcmF0YWhtZWRuYWllbUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJnb29nbGUuY29tIjpbIjExMTU3Mzg4MDk4MDI2Mjc2MTY4OSJdLCJlbWFpbCI6WyJtZHJhdGFobWVkbmFpZW1AZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiZ29vZ2xlLmNvbSJ9fQ.ji7Ef3RhEZnYEJayC9yj4jR3QnFcggydJAi6J6Lh-35lo7PTwWLyfeuIVRyq3A7j2PrkGa0a_0M2WnbItCPaQdqcFdNNiURHf_HOe2udt8GP6aR_MRlQphf2e1YwmtvZvEC-72emQU2cgoXxi7qBLdcRspwR8W5Y152BVFDsjYNTAw6Jqts9SPpSiSpbA4dSuTZtkqvNTdeoFIjeGRhmVcs7zRr__-2iTXctXSYymC9JTJKWsn5DXzi7HGVEguxMOIVpxQYGBqgG61hzGy2BD8S8pp-Aa_fainJiIvawaSIENNDCagC9CBflqaYrLsw_GmHnLN0lBIOgyp-u1_o0yw
