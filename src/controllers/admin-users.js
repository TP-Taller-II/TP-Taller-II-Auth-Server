'use strict';

const { adminUsers, TokenServices } = require('../services/index');
const { getUser, getAllUsers } = require('./users');
const STATUS_CODES = require('../utils/status-codes.json');


const tokenServices = new TokenServices();

const signIn = async (req, res) => {
	console.log('AdminUserController - signIn');
	try {
		const { email, password: passwordToValidate } = req.body;

		const adminUser = await adminUsers.getAdminUserByEmail(email);

		if (!adminUser)
			return res.status(STATUS_CODES.BAD_REQUEST).send({ message: 'Invalid email' });

		const { password, ...formattedAdminUser } = adminUser;

		const areCredentialsValid = await adminUsers.validateCredentials(passwordToValidate, password);
		if (!areCredentialsValid)
			return res.status(STATUS_CODES.BAD_REQUEST).send({ message: 'Invalid email or password' });

		const token = await tokenServices.generateToken(formattedAdminUser);
		await adminUsers.updateToken(adminUser._id, token);

		res.header('x-auth-token', token)
			.status(STATUS_CODES.OK)
			.send({ ...formattedAdminUser, accessToken: token });

	} catch (error) {
		return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ message: error.message });
	}
};

const getUserById = (req, res) => {
	const { id } = req.params;
	return getUser(id, res);
};

const getAllUsersAsAdmin = (req, res) => {
	const { id } = req.params;
	// Todo: map to get only _id and email !!!!
	return getAllUsers(id, res);
};

const signOut = async (req, res) => {
	try {

		const { session: { _id } } = req;

		await adminUsers.removeToken(_id);

		res.status(STATUS_CODES.OK).send({ message: 'User sign out' });
	} catch ({ message }) {
		res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ message });
	}
};

module.exports = {
	getUserById,
	getAllUsersAsAdmin,
	signIn,
	signOut,
};
