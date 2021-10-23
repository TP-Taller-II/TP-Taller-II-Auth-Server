'use strict';

module.exports = {
	AdminUser: {
		type: 'object',
		properties: {
			id: {
				type: 'string',
				description: 'The user\'s ID',
				readOnly: true,
				required: true,
				example: '5fa8b079f434eb9070ac48c6',
			},
			password: {
				type: 'string',
				description: 'The user\'s password',
				example: 'joes super secret password',
				required: true,
				writeOnly: true,
			},
			email: {
				type: 'string',
				description: 'The user\'s email',
				format: 'email',
				required: true,
				example: 'joe_doe@gmail.com',
			},
		},
	},
};
