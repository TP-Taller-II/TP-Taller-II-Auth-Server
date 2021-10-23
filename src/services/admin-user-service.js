'use strict';

const Bcrypt = require('bcrypt');
const { adminUserSchema } = require('../schemas/index');
const Model = require('../databases/mongodb/model');


const adminUserModel = new Model('adminusers', adminUserSchema);

// Todo: extract repeated code !!!!
const validateCredentials = (passwordToValidate, password) => {
	return Bcrypt.compare(passwordToValidate, password);
};

const getAdminUserByEmail = async email => {
	const [user] = await adminUserModel.findBy('email', email);
	return user;
};

const getAdminUserById = async id => {
	const [user] = await adminUserModel.findBy('_id', id);
	return user;
};

const updateToken = async (_id, accessToken) => {
	return adminUserModel.update({ _id }, { accessToken });
};

const removeToken = async _id => {
	return adminUserModel.update({ _id }, { accessToken: null });
};


module.exports = {
	getAdminUserByEmail,
	getAdminUserById,
	validateCredentials,
	updateToken,
	removeToken,
};
