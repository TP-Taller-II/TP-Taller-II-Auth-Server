'use strict';

module.exports = {
	'./**/*.js': filesPaths => ([
		`eslint --fix ${filesPaths.join(' ')}`,
		'npm run test --silent'
	])
};
