'use strict';

module.exports = {
	ShareRequest: {
		type: 'object',
		properties: {
			guestEmail: {
				type: 'string',
				required: true,
				description: 'The email of the user who receives the file',
				example: 'joedoe@gmail.com'
			},
			hostEmail: {
				type: 'string',
				required: true,
				description: 'The email of the user who shares the file',
				example: 'maryDoe@gmail.com'
			},
			canShare: {
				type: 'boolean',
				required: true,
				description: 'true if the guest can share the file',
				example: false
			},
			fileId: {
				type: 'string',
				required: true,
				description: 'The id of the file to be shared',
				example: '2228b079f434eb9070ac48c6'
			},
			accepted: {
				type: 'boolean',
				readOnly: true,
				description: 'true when the guest accepted the share request',
				example: true
			}
		}
	}
};
