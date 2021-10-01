'use strict';

module.exports = {
	post: {
		tags: ['ShareRequest'],
		description: 'Create a share request',
		operationId: 'createAShareRequest',
		requestBody: {
			description: 'A share request',
			required: true,
			content: {
				'application/json': {
					schema: {
						$ref: '#/components/schemas/ShareRequest'
					}
				}
			}
		},
		responses: {
			200: {
				description: 'The share request was succesfully sign up',
				content: {
					'application/json': {
						schema: {
							type: 'object',
							properties: {
								message: {
									type: 'string',
									description: 'a message',
									example: 'The file share invitation was sent'
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
