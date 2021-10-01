'use strict';

module.exports = {
	patch: {
		tags: ['Users'],
		description: 'Patch',
		operationId: 'Path me',
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
				description: 'The user was succesfully updated',
				content: {
					'application/json': {
						schema: {
							$ref: '#/components/schemas/User'
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
