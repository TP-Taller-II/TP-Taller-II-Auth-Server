'use strict';

const { userService, TokenServices } = require('../services/index');
const STATUS_CODES = require('../utils/status-codes.json');

const tokenServices = new TokenServices();

const signUp = async (req, res) => {
	try {
		const userData = req.body;
		const { password, ...user } = await userService.createUser(userData);
		const token = await tokenServices.generateToken(user);
		await userService.updateToken(user._id, token);

		res.header('x-auth-token', token)
			.status(STATUS_CODES.OK)
			.send({ accessToken: token, ...user });

	} catch (error) {
		return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ message: error.message });
	}
};

const signInEmail = async (req, res) => {
	const {
		email,
		password: passwordToValidate,
	} = req.body;

	const user = await userService.getUserByEmail(email);

	if (!user)
		return res.status(STATUS_CODES.BAD_REQUEST)
			.send({ message: 'Invalid email' });

	const {
		password,
		...formattedUser
	} = user;

	const areCredentialsValid = await userService.validateCredentials(passwordToValidate, password);

	if (!areCredentialsValid)
		return res.status(STATUS_CODES.BAD_REQUEST)
			.send({ message: 'Invalid email or password' });

	const token = await tokenServices.generateToken(formattedUser);
	await userService.updateToken(user._id, token);

	res.header('x-auth-token', token)
		.status(STATUS_CODES.OK)
		.send({
			...formattedUser,
			accessToken: token,
		});
};

// const signInGoogle = async (req, res) => {
// 	const {
// 		email,
// 		password: passwordToValidate
// 	} = req.body;
//
// 	const user = await userService.getUserByEmail(email);
//
// 	if (!user)
// 		return res.status(STATUS_CODES.BAD_REQUEST)
// 			.send({ message: 'Invalid email' });
//
// 	const {
// 		password,
// 		...formattedUser
// 	} = user;
//
// 	const areCredentialsValid = await userService.validateCredentials(passwordToValidate, password);
//
// 	if (!areCredentialsValid)
// 		return res.status(STATUS_CODES.BAD_REQUEST)
// 			.send({ message: 'Invalid email or password' });
//
// 	const token = await tokenServices.generateToken(formattedUser);
// 	await userService.updateToken(user._id, token);
//
// 	res.header('x-auth-token', token)
// 		.status(STATUS_CODES.OK)
// 		.send({
// 			...formattedUser,
// 			accessToken: token
// 		});
//
// };

const signIn = async (req, res) => {
	try {

		const { provider } = req.body;

		if (provider === 'email') {
			return await signInEmail(req, res);
		}

		return res.status(STATUS_CODES.BAD_REQUEST).send({ message: `Invalid provider: ${provider}` });
	} catch (error) {
		return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR)
			.send({ message: error.message });
	}
};

const getUser = async (id, res) => {

	try {

		const { password, token, ...user } = await userService.getUserById(id);

		res.status(STATUS_CODES.OK).send(user);

	} catch (error) {
		return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ message: error.message });
	}
};

// Todo: filter out not public data ['visualización de perfil de otros usuarios'] !!!!
const getUserById = (req, res) => {
	const { id } = req.params;
	return getUser(id, res);
};

const getMe = async (req, res) => {
	const { session: { _id } } = req;

	try {

		const { password, token, ...user } = await userService.getUserById(_id);

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

		const currentUser = await userService.getUserById(_id);

		if (!await userService.validateCredentials(password, currentUser.password))
			throw new Error('Password is not valid');

		const { password: passwordUpdated, ...userUpdated } = await userService.updateUser({ ...req.body, _id });

		const token = await tokenServices.generateToken(userUpdated);
		await userService.updateToken(_id, token);

		res.header('x-auth-token', token).status(STATUS_CODES.OK)
			.send({ ...userUpdated, accessToken: token });
	} catch (error) {
		return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ message: error.message });
	}
};

const signOut = async (req, res) => {
	try {

		const { session: { _id } } = req;

		await userService.removeToken(_id);

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
	signOut,
	getUser,
};
