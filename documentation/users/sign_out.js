'use strict';

module.exports = {
	post: {
		tags: ['Users'],
		description: 'Sign out',
		operationId: 'userSignOut',
		security: [{
			bearerAuth: []
		}],
		requestBody: {
			description: 'A user',
			required: true,
			content: {
				'application/json': {
					schema: {
						$ref: '#/components/schemas/User'
					}
				}
			}
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
									example: 'User sign out'
								}
							}
						}
					}
				}
			},
			401: {
				description: 'Unauthorized',
				content: {
					'application/json': {
						schema: {
							$ref: '#/components/responses/UnauthorizedError'
						}
					}
				}
			},
			500: {
				description: 'Internal server error',
				content: {
					'application/json': {
						schema: {
							$ref: '#/components/responses/InternalServerError'
						}
					}
				}
			}
		}
	}
};
