'use strict';

module.exports = {
	get: {
		tags: ['ShareRequest'],
		description: 'GetShareRequestAccepted',
		operationId: 'GetShareRequestAccepted',
		security: [{
			bearerAuth: []
		}],
		responses: {
			200: {
				description: 'Share request acceptance',
				content: {
					'application/json': {
						schema: {
							type: 'object',
							properties: {
								message: {
									type: 'string',
									description: 'a message',
									example: 'The file share invitation was accepted'
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
