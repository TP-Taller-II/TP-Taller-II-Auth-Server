'use strict';

module.exports = path => {
	const pathSplitted = path.split('/');
	pathSplitted.shift();
	return pathSplitted.join('/');
};
