'use strict';

const jwt = require('jsonwebtoken');
const { addHoursToDate } = require('../helpers/date-helper');
const { userSchema, adminUserSchema } = require('../schemas/index');
const userServices = require('./user-service');
const Model = require('../databases/mongodb/model');
const config = require('../../config/config');

const EXPIRATION_HOURS = 480; // !!!! chsnge to 4
const secret = config.auth.jwtSigningSecret;

class TokenServices {

	async verifyToken(token) {

		const payload = jwt.verify(token, secret);
		const { _id } = payload;
		const userModel = new Model('users', userSchema);
		const adminuserModel = new Model('adminusers', adminUserSchema);

		if (new Date(payload.expirationDate) <= new Date()) {
			await userServices.removeToken(_id);
			throw new Error('Token expired');
		}

		const [user] = await userModel.findBy('_id', _id);
		const [adminUser] = await adminuserModel.findBy('_id', _id);

		if (!user && !adminUser)
			throw new Error('Invalid token. User does not exist');

		if (user && (!user.accessToken || user.accessToken !== token))
			throw new Error('Token expired');

		if (adminUser && (!adminUser.accessToken || adminUser.accessToken !== token))
			throw new Error('Token expired');

		return payload;
	}

	async generateToken({ email, _id }) {
		const creationDate = new Date();

		const payload = {
			email,
			_id,
			creationDate,
			expirationDate: addHoursToDate(EXPIRATION_HOURS, creationDate),
		};

		return jwt.sign(payload, secret);
	}
}


module.exports = TokenServices;
