// external imports
const { getAuth } = require('firebase-admin/auth');
const jwt = require('jsonwebtoken');

// internal imports
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');

async function authenticate(req, res) {
	// get firebase idToken from headers
	const authToken = req.headers.authorization;
	const token = authToken && authToken.split(' ')[1];

	// if token is unavailable - send unauthorized response
	if (!token) return res.sendStatus(401);

	// get a auth instance
	const auth = getAuth();

	try {
		// verify token
		const decodedToken = await auth.verifyIdToken(token);
		const { name, picture, email, email_verified, uid } = decodedToken;

		// save user data
		const userData = {
			userEmail: email,
			userId: decodedToken?._id,
			role: decodedToken?.role,
		};

		// if user doesn't exist - save user data to database
		if (!decodedToken?._id || !decodedToken?.role) {
			// save user to database
			await User.init();

			const newUser = await User.create({
				name,
				email,
				emailVerified: email_verified,
				img: picture,
			});

			// store user id and role
			userData.userId = newUser._id;
			userData.role = newUser.role;

			// save user id and role to firebase
			await auth.setCustomUserClaims(uid, {
				_id: newUser._id,
				role: newUser.role,
			});
		}

		// generate access and refresh tokens
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

		// save refresh token to database and delete one if an exists for the user
		await RefreshToken.deleteOne({ userId: userData.userId });
		await RefreshToken.create({
			userId: userData.userId,
			token: refreshToken,
		});

		// send response to user
		res.cookie(process.env.REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
			maxAge: 30 * 24 * 60 * 60 * 1000,
			httpOnly: true,
			signed: true,
			secure: true,
		});
		res.json({ msg: 'Successful', user: userData, accessToken });
	} catch (err) {
		console.log(err);

		// if the firebase idToken is expired
		if (err.code === 'auth/id-token-expired') {
			res.status(403).json({
				error: { msg: 'Firebase auth token expired' },
			});
		}

		// If user validation failed
		else if (err._message === 'User validation failed') {
			const { uid } = await auth.verifyIdToken(token);

			// delete user from firebase
			await auth.deleteUser(uid);
			res.status(400).json({ error: { msg: 'User validation failed' } });
		}

		// if any duplicate data found in the database
		else if (err.code === 11000) {
			console.log(err);
			res.status(409).json({
				error: {
					msg: `A user with the ${
						Object.keys(err.keyValue)[0]
					} already exists`,
				},
			});
		}

		// otherwise
		else {
			res.sendStatus(500);
		}
	}
}

async function logout(req, res) {
	const userId = req.user.userId;

	try {
		// delete refresh token from the server
		const result = await RefreshToken.deleteOne({ userId });

		// if error occurred
		if (result.deletedCount <= 0) {
			// send response back to the client
			res.status(500).json({
				msg: 'Something went wrong! Please try again.',
			});
		}

		// send response back to the client
		res.clearCookie(process.env.REFRESH_TOKEN_COOKIE_NAME);
		res.status(200).json({ msg: 'Logout successful.' });
	} catch (error) {
		// send response back to the client
		res.status(500).json({
			msg: 'Something went wrong! Please try again.',
		});
	}
}

async function generateToken(req, res) {
	console.log('object');
}

module.exports = { authenticate, logout, generateToken };
