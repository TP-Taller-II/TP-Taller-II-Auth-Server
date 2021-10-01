'use strict';

module.exports = {
	post: {
		tags: ['Users'],
		description: 'Sign in',
		operationId: 'userSignIn',
		requestBody: {
			description: 'A user',
			required: true,
			content: {
				'application/json': {
					schema: {
						type: 'object',
						description: 'The user data to signs in',
						properties: {
							email: {
								$ref: '#/components/schemas/User/properties/email'
							},
							password: {
								$ref: '#/components/schemas/User/properties/password'
							}
						}
					}
				}
			}
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
									example: 'user signed'
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
