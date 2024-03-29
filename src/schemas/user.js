'use strict';

const mongoose = require('mongoose');

// profile pic missing
const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'A name is required'],
		},
		surname: {
			type: String,
			required: [true, 'A surname is required'],
		},
		provider: {
			type: String,
			enum: ['email', 'google'],
			required: [true, 'Provider is required'],
		},
		profilePic: String,
		password: {
			type: String,
			// eslint-disable-next-line no-unused-expressions
			required: [function() { this.provider === 'email'; }, 'A password is required'],
		},
		email: {
			type: String,
			trim: true,
			lowercase: true,
			index: { unique: true },
			required: [true, 'Email address is required'],
			match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
		},
		accessToken: {
			type: String,
		},
	},
	{
		timestamps: true,
	});


userSchema.index({ email: 1 }, { unique: true });
module.exports = userSchema;
