
'use strict';

const { adminUserService } = require('./../services/index');
const STATUS_CODES = require('../utils/status-codes.json');


module.exports = async (req, res, next) => {
	const { session: { _id } } = req;

	try {
		const adminUser = await adminUserService.getAdminUserById(_id);
		if (!adminUser)
			return res.status(STATUS_CODES.FORBIDDEN).send({ message: 'Access denied. Not an admin user.' });

		next();
	} catch (err) {
		res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ message: err.message });
	}
};
