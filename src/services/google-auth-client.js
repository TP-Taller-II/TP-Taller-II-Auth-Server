'use strict';

const axios = require('axios');
const logger = require('../helpers/logger');

const baseUrl = 'https://oauth2.googleapis.com';
const endpoint = '/tokeninfo';

const validateIdToken = async googleIdToken => {
	const response = await axios.get(`${baseUrl}${endpoint}?id_token=${googleIdToken}`);
	logger.info(`GoogleAuthClient - validateIdToken - ${response.data}`);
	return response.data;
};

module.exports = {
	validateIdToken,
};
