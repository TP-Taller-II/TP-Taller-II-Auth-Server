'use strict';

const components = require('./components');
const paths = require('./paths');

const options = {
	openapi: '3.0.1',
	info: {
		title: 'API documentation',
		version: '1.0.0',
		description: 'API documentation',
	},
	servers: [
		{
			url: 'localhost:8080/api',
		},
	],
	tags: [
		{
			name: 'Users',
			description: 'Related with users',
		},
		{
			name: 'AdminUsers',
			description: 'Related with admin users',
		},
	],
	security: [
		{
			bearerAuth: [],
		},
	],
	...components,
	...paths,
};

module.exports = options;
