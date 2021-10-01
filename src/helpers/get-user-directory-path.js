'use strict';

module.exports = path => {

	const pathSplitted = path.split('/');
	pathSplitted.pop();
	const fileName = pathSplitted.pop();
	return [pathSplitted.join('/').concat('/'), fileName];
};
