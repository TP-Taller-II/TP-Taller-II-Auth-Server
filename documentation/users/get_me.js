'use strict';

module.exports = {
	get: {
		tags: ['Users'],
		description: 'Get me',
		operationId: 'getUserme',
		security: [{
			bearerAuth: []
		}],
		responses: {
			200: {
				description: 'User was found',
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
										example: 'User not found'
									}
								}
							}
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
