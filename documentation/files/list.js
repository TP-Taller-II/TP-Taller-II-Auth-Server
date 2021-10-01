'use strict';

module.exports = {
	get: {
		tags: ['Files'],
		description: 'Get files',
		operationId: 'getFiles',
		security: [{
			bearerAuth: []
		}],
		responses: {
			200: {
				description: 'Files were obtained',
				content: {
					'application/json': {
						schema: {
							$ref: '#/components/schemas/Files'
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
