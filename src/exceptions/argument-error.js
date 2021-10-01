'use strict';

class ArgumentError extends Error {

	constructor(args) {
		super(args);
		this.name = 'ArgumentError';
	}
}

module.exports = ArgumentError;
