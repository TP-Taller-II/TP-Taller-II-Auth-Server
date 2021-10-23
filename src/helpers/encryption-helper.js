'use strict';

const Bcrypt = require('bcrypt');

const compare = (plain, encrypted) => {
	return Bcrypt.compare(plain, encrypted);
};

const encrypt = async plain => {
	const salt = await Bcrypt.genSalt(10);
	return Bcrypt.hash(plain, salt);
};

module.exports = {
	compare,
	encrypt,
};
