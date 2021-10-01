'use strict';

module.exports = (path, userId) => {
	return userId.concat('/', path);
};
