// external import
const express = require('express');
const jwt = require('jsonwebtoken');
const { getAuth } = require('firebase-admin/auth');

// internal imports
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');

const router = express.Router();

router.post('/login', async (req, res) => {
	const authHeader = req.headers.authorization;
	const token = authHeader && authHeader.split(' ')[1];

	// send unauthorized status
	if (!token) return res.sendStatus(401);

	const auth = getAuth();

	try {
		const decodedToken = await auth.verifyIdToken(token);
		const { name, picture, email, email_verified, uid } = decodedToken;

		// if user does not exist
		if (!decodedToken?.role || !decodedToken?._id) {
			// create a new user
			await User.init();
			const newUser = new User({
				name,
				email,
				emailVerified: email_verified,
				img: picture,
			});

			// save user to database
			newUser
				.save()
				.then(async () => {
					// save custom claims in firebase
					await auth.setCustomUserClaims(uid, {
						_id: newUser._id,
						role: 'student',
					});
				})
				.catch(async () => {
					// error occurred - delete user from firebase
					await auth.deleteUser(uid);
					res.sendStatus(500);
				});
		}

		// generate access and refresh tokens
		const userData = {
			email,
			_id: decodedToken._id,
			role: decodedToken.role,
		};

		const accessToken = jwt.sign(
			userData,
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: '1h' }
		);

		const refreshToken = jwt.sign(
			userData,
			process.env.REFRESH_TOKEN_SECRET,
			{ expiresIn: '30 days' }
		);

		// save refresh token to database
		await RefreshToken.create({
			userId: decodedToken._id,
			token: refreshToken,
		});

		// send response to user
		res.cookie('refreshToken', refreshToken, {
			maxAge: 30 * 24 * 60 * 60 * 1000,
			httpOnly: true,
			signed: true,
			secure: true,
		});
		res.json({ msg: 'Successful', accessToken });
	} catch (err) {
		console.log(err);
	}
});

module.exports = router;
