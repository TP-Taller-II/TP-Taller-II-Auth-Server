'use strict';

module.exports = ({ path, ...file }) => {

	const pathSplitted = path.split('/');

	pathSplitted.shift();

	const pathFormatted = pathSplitted.join('/');

	return {
		...file,
		fullPath: pathFormatted.concat(file.name),
		path: pathFormatted,
	};
};
