'use strict';

const { users, TokenServices } = require('../services/index');
const STATUS_CODES = require('../utils/status-codes.json');

const tokenServices = new TokenServices();

const signUp = async (req, res) => {

	try {

		const userData = req.body;
		const { password, ...user } = await users.createUser(userData);
		const token = await tokenServices.generateToken(user);
		await users.updateToken(user._id, token);

		res.header('x-auth-token', token)
			.status(STATUS_CODES.OK)
			.send({ accessToken: token, ...user });

	} catch (error) {
		return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ message: error.message });
	}
};

const signIn = async (req, res) => {
	console.log('signIn');

	try {
		const { email, password: passwordToValidate } = req.body;

		const user = await users.getUserByEmail(email);

		if (!user)
			return res.status(STATUS_CODES.BAD_REQUEST).send({ message: 'Invalid email' });

		const { password, ...formattedUser } = user;

		const areCredentialsValid = await users.validateCredentials(passwordToValidate, password);

		if (!areCredentialsValid)
			return res.status(STATUS_CODES.BAD_REQUEST).send({ message: 'Invalid email or password' });

		const token = await tokenServices.generateToken(formattedUser);
		await users.updateToken(user._id, token);

		res.header('x-auth-token', token)
			.status(STATUS_CODES.OK)
			.send({ ...formattedUser, accessToken: token });

	} catch (error) {
		return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ message: error.message });
	}
};

const getUser = async (id, res) => {

	try {

		const { password, token, ...user } = await users.getUserById(id);

		res.status(STATUS_CODES.OK).send(user);

	} catch (error) {
		return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ message: error.message });
	}
};

const getUserById = (req, res) => {
	const { id } = req.params;
	return getUser(id, res);
};

const getMe = async (req, res) => {

	const { session: { _id } } = req;

	try {

		const { password, token, ...user } = await users.getUserById(_id);

		res.status(STATUS_CODES.OK).send(user);
	} catch (error) {
		return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ message: error.message });
	}
};

const updateUser = async (req, res) => {

	const { _id } = req.session;
	const { password } = req.body;

	try {

		if (!password)
			throw new Error('To update user password is required');

		const currentUser = await users.getUserById(_id);

		if (!await users.validateCredentials(password, currentUser.password))
			throw new Error('Password is not valid');

		const { password: passwordUpdated, ...userUpdated } = await users.updateUser({ ...req.body, _id });

		const token = await tokenServices.generateToken(userUpdated);
		await users.updateToken(_id, token);

		res.header('x-auth-token', token).status(STATUS_CODES.OK)
			.send({ ...userUpdated, accessToken: token });
	} catch (error) {
		return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ message: error.message });
	}
};

const oauthSignUp = async (req, res) => {

	try {

		const userData = req.body;
		const { password, ...user } = await users.createUser({ ...userData, provider: 'google' });
		const token = await tokenServices.generateToken(user);
		await users.updateToken(user._id, token);

		res.header('x-auth-token', token)
			.status(STATUS_CODES.OK)
			.send({ ...user, accessToken: token });

	} catch (error) {
		return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ message: error.message });
	}
};

const oauthSignIn = async (req, res) => {

	try {
		const { email } = req.body;

		const user = await users.getUserByEmail(email);

		if (!user)
			return res.status(STATUS_CODES.BAD_REQUEST).send({ message: 'Invalid email' });

		const token = await tokenServices.generateToken(user);
		await users.updateToken(user._id, token);

		res.header('x-auth-token', token)
			.status(STATUS_CODES.OK)
			.send({ ...user, accessToken: token });

	} catch (error) {
		return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ message: error.message });
	}
};

const signOut = async (req, res) => {

	try {

		const { session: { _id } } = req;

		await users.removeToken(_id);

		res.status(STATUS_CODES.OK).send({ message: 'User sign out' });
	} catch ({ message }) {
		res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ message });
	}
};

module.exports = {
	signUp,
	getUserById,
	getMe,
	signIn,
	updateUser,
	getUser,
	oauthSignUp,
	oauthSignIn,
	signOut,
};
