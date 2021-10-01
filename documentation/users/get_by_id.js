'use strict';

module.exports = {
	get: {
		tags: ['Users'],
		description: 'Get User by ID',
		operationId: 'getUserById',
		security: [{
			bearerAuth: []
		}],
		parameters: [
			{
				name: 'id',
				in: 'path',
				description: 'The User Id',
				required: true,
				schema: {
					type: 'string',
					example: '5fa8bc139dcdec8512fc2604'
				}
			}
		],
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
