'use strict';

module.exports = {
	post: {
		tags: ['AdminUsers'],
		description: 'Admin Sign out',
		operationId: 'userSignOut',
		security: [{
			bearerAuth: [],
		}],
		requestBody: {
			description: 'A user',
			required: true,
			content: {
				'application/json': {
					schema: {
						$ref: '#/components/schemas/AdminUser',
					},
				},
			},
		},
		responses: {
			200: {
				description: 'The user was succesfully sign out',
				content: {
					'application/json': {
						schema: {
							type: 'object',
							properties: {
								message: {
									type: 'string',
									example: 'User sign out',
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
			403: {
				description: 'Forbidden',
				content: {
					'application/json': {
						schema: {
							$ref: '#/components/responses/ForbiddenError',
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
