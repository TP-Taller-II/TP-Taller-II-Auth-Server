'use strict';

console.log("Starting Mongo" ); // Debugeando JS + Heroku
const mongoose = require('mongoose');
const config = require('../../config/config');

console.log("Reading Config"); // Debugeando JS + Heroku
const { host, port } = config.db;
let uri = `mongodb://${host}:${port}/app`;
let uri = "mongodb+srv://ubademy-g2:" + process.env.MONGO_DB_PASS + "@auth-server.i7qbi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

module.exports = () => {
	mongoose.connect(uri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
		autoIndex: true,
	})
		.then(() => console.log('Connected to database'))
		.catch(e => console.log(e));
};
