'use strict';

module.exports = path => {

	if (path === '/')
		return '';

	const pathSplitted = path.split('/');

	if (pathSplitted[0] === '')
		pathSplitted.shift();

	if (pathSplitted[pathSplitted.length - 1] === '')
		pathSplitted.pop();

	return pathSplitted.join('/').concat('/');
};
