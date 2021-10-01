'use strict';

module.exports = {
	File: {
		type: 'object',
		properties: {
			user: {
				type: 'string',
				description: 'The user\'s ID',
				readOnly: true,
				required: true,
				example: '5fa8b079f434eb9070ac48c6'
			},
			name: {
				type: 'string',
				description: 'The files\'s name',
				required: true,
				example: 'my-file.txt'
			},
			type: {
				type: 'string',
				description: 'The file\'s type',
				enum: ['file', 'directory'],
				required: true
			},
			url: {
				type: 'string',
				description: 'The file\'s firebase url',
				example: 'https://someurl.com'
			},
			path: {
				type: 'string',
				description: 'The files\'s path',
				required: true,
				example: '/some-dir/some-inner-dir/'
			},
			canRead: {
				type: 'boolean',
				description: 'true if the user can read the file',
				example: true
			},
			canShare: {
				type: 'boolean',
				description: 'true if the user can share the file',
				example: true
			}
		}
	},
	Files: {
		type: 'array',
		items: {
			$ref: '#/components/schemas/File'
		}
	}
};
