'use strict';

module.exports = {
	post: {
		tags: ['AdminUsers'],
		description: 'Admin Sign in',
		operationId: 'adminUserSignIn',
		requestBody: {
			description: 'An admin user',
			required: true,
			content: {
				'application/json': {
					schema: {
						type: 'object',
						description: 'The admin user data to signs in',
						properties: {
							email: {
								$ref: '#/components/schemas/AdminUser/properties/email',
							},
							password: {
								$ref: '#/components/schemas/AdminUser/properties/password',
							},
						},
					},
				},
			},
		},
		responses: {
			200: {
				description: 'The user was succesfully sign up',
				content: {
					'application/json': {
						schema: {
							type: 'object',
							properties: {
								message: {
									type: 'string',
									example: 'user signed',
								},
							},
						},
					},
				},
			},
			401: {
				description: 'Unauthorized',
				content: {
					'application/json': {
						schema: {
							$ref: '#/components/responses/UnauthorizedError',
						},
					},
				},
			},
			500: {
				description: 'Internal server error',
				content: {
					'application/json': {
						schema: {
							$ref: '#/components/responses/InternalServerError',
						},
					},
				},
			},
		},
	},
};
