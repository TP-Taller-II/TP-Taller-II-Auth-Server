'use strict';

const mongoose = require('mongoose');
const config = require('../../config/config');

const { host, port } = config.db;

module.exports = () => {
	mongoose.connect(`mongodb://${host}:${port}/app`, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
		autoIndex: true,
	})
		.then(() => console.log('Connected to database'))
		.catch(e => console.log(e));
};
