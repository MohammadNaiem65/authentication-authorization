const jwt = require('jsonwebtoken');

function checkAuth(req, res, next) {
	const authToken = req.headers.authorization;
	const token = authToken && authToken.split(' ')[1];

	// send unauthorized response
	if (!token) return res.sendStatus(401);

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
		if (!user) {
			res.status(403).json({ msg: err.message });
			next(err.message);
		}

		// save user in request body
		req.user = user;
	});
	next();
}

module.exports = checkAuth;
