'use strict';

const jwt = require('jsonwebtoken');
const { addHoursToDate } = require('../helpers/date');
const { userSchema } = require('../schemas/index');
const userServices = require('./user-service');
const Model = require('../databases/mongodb/model');

const EXPIRATION_HOURS = 480; // !!!! chsnge to 4
const secret = 'puchero12';

class TokenServices {

	async verifyToken(token) {

		const payload = jwt.verify(token, secret);
		const { _id } = payload;
		const userModel = new Model('Users', userSchema);

		if (new Date(payload.expirationDate) <= new Date()) {
			await userServices.removeToken(_id);
			throw new Error('Token expired');
		}

		const [user] = await userModel.findBy('_id', _id);

		if (!user)
			throw new Error('Invalid token. User does not exist');

		if (!user.accessToken || user.accessToken !== token)
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
