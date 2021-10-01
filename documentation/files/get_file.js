'use strict';

module.exports = {
	get: {
		tags: ['Files'],
		description: 'Get File by Path',
		operationId: 'getFileByPath',
		security: [{
			bearerAuth: []
		}],
		parameters: [
			{
				name: 'Path',
				in: 'query',
				description: 'The file Path',
				required: true,
				schema: {
					type: 'string',
					example: '/my-dir/inner-dir/my_file.txt'
				}
			}
		],
		responses: {
			200: {
				description: 'File was found',
				content: {
					'application/json': {
						schema: {
							$ref: '#/components/schemas/File'
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
										example: 'File not found'
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
