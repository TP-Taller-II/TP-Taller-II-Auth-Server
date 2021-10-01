'use strict';

module.exports = {
	post: {
		tags: ['Users'],
		description: 'Sign up',
		operationId: 'userSignUp',
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
				description: 'The user was succesfully sign up',
				content: {
					'application/json': {
						schema: {
							type: 'object',
							properties: {
								$ref: '#/components/schemas/User/'
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
