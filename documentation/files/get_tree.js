'use strict';

module.exports = {
	get: {
		tags: ['Files'],
		description: 'Get tree',
		operationId: 'getTree',
		security: [{
			bearerAuth: []
		}],
		responses: {
			200: {
				description: 'Tree was found',
				content: {
					'application/json': {
						// AGREGAR EL SCHEMA DE UN TREE
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
