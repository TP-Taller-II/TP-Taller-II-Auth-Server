'use strict';

const env = (process.env.NODE_ENV || 'dev').trim();

console.log('Config Environment: ' + env);


const defaultConfig = {
	db: {
		protocol: 'mongodb',
		host: 'localhost:27017',
		name: 'authServerDB',
	},
	auth: {
		jwtSigningSecret: 'puchero12',
	},
	metric: {
		enabled: false,
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
		protocol: 'mongodb',
		host: 'mongo:27017',
		name: '',
	},
};

const prod = {
	...defaultConfig,
	db: {
		protocol: 'mongodb+srv',
		host: `ubademy-g2:${process.env.MONGO_DB_PASS}@auth-server.i7qbi.mongodb.net`,
		opts: 'retryWrites=true&w=majority',
	},
	auth: {
		jwtSigningSecret: process.env.JWT_SIGNING_SECRET,
	},
	metric: {
		enabled: true,
	},
};

const config = {
	dev,
	test,
	docker,
	prod,
};

module.exports = config[env];
