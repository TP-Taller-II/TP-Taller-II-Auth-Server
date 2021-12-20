'use strict';

const axios = require('axios');


const baseUrl = 'https://oauth2.googleapis.com';
const endpoint = '/tokeninfo';

const validateIdToken = async googleIdToken => {
	const response = await axios.get(`${baseUrl}${endpoint}?id_token=${googleIdToken}`);
	console.log(`GoogleAuthClient - validateIdToken - ${response.data}`);
	return response.data;
};

module.exports = {
	validateIdToken,
};
