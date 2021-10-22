'use strict';

const env = process.env.NODE_ENV || 'dev';
console.log('Config Environment: ' + env);


const defaultConfig = {
	db: {
		protocol: 'mongodb',
		host: 'localhost:27017',
		name: 'auth-server',
	},
};

const dev = {
	...defaultConfig,
};

const test = {
	...defaultConfig,
};

const docker = {
	...defaultConfig,
	db: {
		host: 'mongo:27017',
	},
};

const prod = {
	...defaultConfig,
	db: {
		protocol: 'mongodb+srv',
		host: `ubademy-g2:${process.env.MONGO_DB_PASS}@auth-server.i7qbi.mongodb.net`,
		opts: 'retryWrites=true&w=majority',
	},
};

const config = {
	dev,
	test,
	docker,
	prod,
};

module.exports = config[env];
