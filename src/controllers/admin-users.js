'use strict';

const { adminUsers, TokenServices } = require('../services/index');
const { getUser, getAllUsers } = require('./users');
const STATUS_CODES = require('../utils/status-codes.json');


const tokenServices = new TokenServices();

const signIn = async (req, res) => {
	try {
		const { email, password: passwordToValidate } = req.body;

		const user = await adminUsers.getAdminUsersByEmails(email);

		if (!user)
			return res.status(STATUS_CODES.BAD_REQUEST).send({ message: 'Invalid email' });

		const { password, ...formattedUser } = user;

		const areCredentialsValid = await adminUsers.validateCredentials(passwordToValidate, password);

		if (!areCredentialsValid)
			return res.status(STATUS_CODES.BAD_REQUEST).send({ message: 'Invalid email or password' });

		const token = await tokenServices.generateToken(formattedUser);
		await adminUsers.updateToken(user._id, token);

		res.header('x-auth-token', token)
			.status(STATUS_CODES.OK)
			.send({ ...formattedUser, accessToken: token });

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
