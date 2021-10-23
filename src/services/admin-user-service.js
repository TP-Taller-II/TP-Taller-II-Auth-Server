'use strict';

const { adminUserSchema } = require('../schemas/index');
const Model = require('../databases/mongodb/model');
const encryptionHelper = require('../helpers/encryption-helper');

const adminUserModel = new Model('adminusers', adminUserSchema);

const validateCredentials = (passwordToValidate, password) => {
	return encryptionHelper.compare(passwordToValidate, password);
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
