const mongoose = require('mongoose');

// create user schema
const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			trim: true,
		},
		email: {
			type: String,
			trim: true,
			unique: true,
			required: true,
		},
		emailVerified: {
			type: Boolean,
			default: false,
		},
		role: {
			type: String,
			enum: ['admin', 'instructor', 'student'],
			default: 'student',
		},
		img: String,
		refreshToken: String,
	},
	{
		timestamps: true,
	}
);

// created user model
const User = mongoose.model('User', userSchema);

module.exports = User;
