'use strict';

const adminUserService = require('./admin-user-service');
const userService = require('./user-service');
const TokenServices = require('./token');

module.exports = {
	adminUserService,
	userService,
	TokenServices,
};
