'use strict';

const mongoose = require('mongoose');

const adminUserSchema = new mongoose.Schema(
	{
		password: {
			type: String,
			required: [true, 'A password is required'],
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


adminUserSchema.index({ email: 1 }, { unique: true });
module.exports = adminUserSchema;
