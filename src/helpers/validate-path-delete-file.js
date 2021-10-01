'use strict';

module.exports = path => {

	if (path === '/')
		return '';

	const pathSplitted = path.split('/');

	if (pathSplitted[0] === '')
		pathSplitted.shift();

	if (pathSplitted[pathSplitted.length - 1] === '')
		pathSplitted.pop();

	const aux = pathSplitted.join('/').concat('/');
	const auxSplitted = aux.split('/');

	if (auxSplitted[auxSplitted.length - 1] === '')
		auxSplitted.pop();

	return auxSplitted.join('/').concat('/');
};
