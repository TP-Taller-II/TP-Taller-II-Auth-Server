'use strict';

const Bcrypt = require('bcrypt');
const { adminUserSchema } = require('../schemas/index');
const Model = require('../databases/mongodb/model');


const adminUserModel = new Model('adminusers', adminUserSchema);

// Todo: extract repeated code !!!!
const validateCredentials = (passwordToValidate, password) => {
	return Bcrypt.compare(passwordToValidate, password);
};

const getAdminUsersByEmails = email => {
	return adminUserSchema.find({ email });
};

const updateToken = async (_id, accessToken) => {
	return adminUserModel.update({ _id }, { accessToken });
};

const removeToken = async _id => {
	return adminUserModel.update({ _id }, { accessToken: null });
};


module.exports = {
	getAdminUsersByEmails,
	validateCredentials,
	updateToken,
	removeToken,
};
