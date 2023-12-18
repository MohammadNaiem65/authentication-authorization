// external imports
const { getAuth } = require('firebase-admin/auth');
const jwt = require('jsonwebtoken');

// internal imports
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');

async function login(req, res) {
	const authHeader = req.headers.authorization;
	const token = authHeader && authHeader.split(' ')[1];

	// send unauthorized status
	if (!token) return res.sendStatus(401);

	const auth = getAuth();

	try {
		const decodedToken = await auth.verifyIdToken(token);
		const { name, picture, email, email_verified, uid } = decodedToken;

		// save user data
		const userData = {
			userEmail: email,
			userId: decodedToken?._id,
			role: decodedToken?.role,
		};

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
			await newUser
				.save()
				.then(async () => {
					// save users data
					userData.userId = newUser._id;
					userData.role = newUser.role;

					// save custom claims in firebase
					auth.setCustomUserClaims(uid, {
						_id: newUser._id,
						role: newUser.role,
					});
				})
				.catch(async () => {
					// error occurred - delete user from firebase
					await auth.deleteUser(uid);
					res.sendStatus(500);
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

		// save refresh token to database
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

module.exports = { login, logout };
