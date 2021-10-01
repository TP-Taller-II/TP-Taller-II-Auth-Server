'use strict';

module.exports = {
	post: {
		tags: ['Files'],
		description: 'Create a file',
		operationId: 'createFile',
		security: [{
			bearerAuth: []
		}],
		requestBody: {
			description: 'A file',
			required: true,
			content: {
				'application/json': {
					schema: {
						$ref: '#/components/schemas/File'
					}
				}
			}
		},
		responses: {
			200: {
				description: 'The file was save succesfully',
				content: {
					'application/json': {
						schema: {
							$ref: '#/components/schemas/File'
						}
					}
				}
			},
			400: {
				description: 'Bad request',
				content: {
					'application/json': {
						schema: {
							Error: {
								type: 'object',
								properties: {
									message: {
										type: 'string',
										example: 'Name should be an string'
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
