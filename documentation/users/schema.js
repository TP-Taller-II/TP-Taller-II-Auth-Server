'use strict';

module.exports = {
	User: {
		type: 'object',
		properties: {
			id: {
				type: 'string',
				description: 'The user\'s ID',
				readOnly: true,
				required: true,
				example: '5fa8b079f434eb9070ac48c6',
			},
			name: {
				type: 'string',
				description: 'The user\'s name',
				required: true,
				example: 'joe',
			},
			password: {
				type: 'string',
				description: 'The user\'s password',
				example: 'joes super secret password',
				writeOnly: true,
			},
			surname: {
				type: 'string',
				description: 'The user\'s surname',
				required: true,
				example: 'Doe',
			},
			email: {
				type: 'string',
				description: 'The user\'s email',
				format: 'email',
				required: true,
				example: 'joe_doe@gmail.com',
			},
			profilePic: {
				type: 'string',
				description: 'The user\'s profile picture.',
				example: 'https://a0.muscache.com/im/pictures/57acf111-9f94-4192-a7ae-7996fb31c1b1.jpg',
			},
			provider: {
				type: 'string',
				description: 'The provider that the user use to singup',
				enum: ['email', 'facebook', 'google'],
				required: true,
				example: 'email',
			},
		},
	},
};
