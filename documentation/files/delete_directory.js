'use strict';

module.exports = {
	delete: {
		tags: ['Files'],
		description: 'delete Directory by url',
		operationId: 'deleteDirectoryByUrl',
		security: [{
			bearerAuth: []
		}],
		parameters: [
			{
				name: 'Path',
				in: 'query',
				description: 'The directory Path',
				required: true,
				schema: {
					type: 'string',
					example: '/my-dir/inner-dir/'
				}
			}
		],
		responses: {
			200: {
				description: 'File Deleted',
				content: {
					'application/json': {
						schema: {
							Error: {
								type: 'object',
								properties: {
									message: {
										type: 'string',
										example: 'Directory with id: 5fa8bc139dcdec8512fc2604 was deleted'
									}
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
										example: 'Publication not found'
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
