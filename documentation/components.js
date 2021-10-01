'use strict';

const users = require('./users/schema');
const files = require('./files/schema');
const shareRequest = require('./share-requests/schema');

module.exports = {
	components: {
		schemas: {
			...users,
			...files,
			...shareRequest
		},
		responses: {
			InternalServerError: {
				type: 'object',
				properties: {
					message: {
						type: 'string',
						example: 'An error occurs when trying to from Database'
					}
				}
			},
			UnauthorizedError: {
				type: 'object',
				properties: {
					message: {
						type: 'string',
						example: 'Access token is missing or invalid'
					}
				}
			}
		}
	},
	securitySchemes: {
		bearerAuth: {
			type: 'http',
			scheme: 'bearer',
			bearerFormat: 'JWT'
		}
	}
};
