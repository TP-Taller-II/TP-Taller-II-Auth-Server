
'use strict';

const { TokenServices } = require('./../services/index');
const STATUS_CODES = require('../utils/status-codes.json');

const tokenServices = new TokenServices();

module.exports = async (req, res, next) => {

	const token = req.header('x-auth-token');

	if (!token)
		return res.status(STATUS_CODES.UNAUTHORIZED).send({ message: 'Access denied. No token provided.' });
	try {
		const payload = await tokenServices.verifyToken(token);
		req.session = payload;
		next();
	} catch (err) {
		res.status(STATUS_CODES.UNAUTHORIZED).send({ message: err.message });
	}
};
