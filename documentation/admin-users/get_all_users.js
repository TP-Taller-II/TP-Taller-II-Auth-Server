'use strict';

module.exports = {
	get: {
		tags: ['AdminUsers'],
		description: 'Get all Users as Admin',
		operationId: 'getAllUsersAsAdmin',
		security: [{
			bearerAuth: [],
		}],
		responses: {
			200: {
				description: 'Users were retrievd',
				content: {
					'application/json': {
						schema: {
							$ref: '#/components/schemas/User',
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
			404: {
				description: 'Not found',
				content: {
					'application/json': {
						schema: {
							Error: {
								type: 'object',
								properties: {
									message: {
										type: 'string',
										example: 'User not found',
									},
								},
							},
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
