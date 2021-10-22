'use strict';

const Bcrypt = require('bcrypt');
const { userSchema } = require('../schemas/index');
const Model = require('../databases/mongodb/model');


const userModel = new Model('Users', userSchema);

const getEncriptedPassword = async password => {
	const salt = await Bcrypt.genSalt(10);
	return Bcrypt.hash(password, salt);
};

const createUser = async user => {

	if (user.provider === 'email') {
		const encriptedPassword = await getEncriptedPassword(user.password);
		return userModel.create({ ...user, password: encriptedPassword });
	}
	return userModel.create(user);
};

const validateCredentials = (passwordToValidate, password) => {
	return Bcrypt.compare(passwordToValidate, password);
};

const getUsersByEmails = email => {
	return userModel.find({ email });
};

const getUserById = async id => {
	const [user] = await userModel.findBy('_id', id);
	return user;
};

const getUserByEmail = async email => {
	const [user] = await userModel.findBy('email', email);
	return user;
};

const updateUser = async userUpdated => {

	let passwordToupdate = null;
	const { _id, newPassword, password, ...userFormatted } = userUpdated;

	if (newPassword)
		passwordToupdate = await getEncriptedPassword(newPassword);

	const updated = await userModel.update({ _id }, { ...userFormatted, ...passwordToupdate && { password: passwordToupdate } });

	if (!updated)
		throw new Error(`It was not possible to update user with ID: ${_id}`);

	return getUserById(_id);
};

const updateToken = async (_id, accessToken) => {
	return userModel.update({ _id }, { accessToken });
};

const removeToken = async _id => {
	return userModel.update({ _id }, { accessToken: null });
};


module.exports = {
	createUser,
	updateUser,
	validateCredentials,
	getEncriptedPassword,
	getUserById,
	getUserByEmail,
	updateToken,
	removeToken,
	getUsersByEmails,
};
