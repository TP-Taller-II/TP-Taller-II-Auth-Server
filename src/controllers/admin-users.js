'use strict';

const { adminUserService, userService, TokenServices } = require('../services/index');
const { getUser } = require('./users');
const STATUS_CODES = require('../utils/status-codes.json');


const tokenServices = new TokenServices();

const signIn = async (req, res) => {
	console.log('AdminUserController - signIn');
	try {
		const { email, password: passwordToValidate } = req.body;

		const adminUser = await adminUserService.getAdminUserByEmail(email);

		if (!adminUser)
			return res.status(STATUS_CODES.BAD_REQUEST).send({ message: 'Invalid email' });

		const { password, ...formattedAdminUser } = adminUser;

		const areCredentialsValid = await adminUserService.validateCredentials(passwordToValidate, password);
		if (!areCredentialsValid)
			return res.status(STATUS_CODES.BAD_REQUEST).send({ message: 'Invalid email or password' });

		const token = await tokenServices.generateToken(formattedAdminUser);
		await adminUserService.updateToken(adminUser._id, token);

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

const getAllUsersAsAdmin = async (req, res) => {
	try {
		const users = await userService.getAllUsers();
		const formattedUsers = users.map(user => (({ _id, email }) => ({ _id, email }))(user));

		res.status(STATUS_CODES.OK).send(formattedUsers);
	} catch (error) {
		return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ message: error.message });
	}
};

const signOut = async (req, res) => {
	try {

		const { session: { _id } } = req;

		await adminUserService.removeToken(_id);

		res.status(STATUS_CODES.OK).send({ message: 'User sign out' });
	} catch ({ message }) {
		res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ message });
	}
};

const userIsAdmin = async (req, res) => {
	const { id } = req.params;

	try {
		const adminUser = await adminUserService.getAdminUserById(id);
		if (!adminUser)
			return res.status(STATUS_CODES.NOT_FOUND).send({ message: 'User is not and admin.' });

		res.status(STATUS_CODES.OK).send({ id });
	} catch (err) {
		res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ message: err.message });
	}
};

module.exports = {
	getUserById,
	getAllUsersAsAdmin,
	signIn,
	signOut,
	userIsAdmin,
};
