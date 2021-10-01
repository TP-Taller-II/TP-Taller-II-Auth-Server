'use strict';

const env = process.env.NODE_ENV || 'dev'; // 'dev' or 'test'

const defaultConfig = {
	marketData: {
		load: true,
	},
	marketListener: {
		enable: true,
		symbolsToListen: [
			'BTCUSDT',
			'BNBUSDT',
			'ETHUSDT',
			'ETHBTC',
			'BNBBTC',
			'DOGEUSDT',
			'CAKEUSDT',
			'BAKEUSDT',
			'XRPUSDT',
		],
	},
	db: {
		host: 'localhost',
		port: 27017,
		name: 'db',
	},
};

const dev = {
	...defaultConfig,
};

const test = {
	...defaultConfig,
	marketListener: {
		enable: false,
	},
	marketData: {
		load: false,
	},
};

const docker = {
	...defaultConfig,
	marketListener: {
		enable: true,
	},
	db: {
		host: 'mongo',
		port: 27017,
		name: 'db',
	},
};


const config = {
	dev,
	test,
	docker,
};

module.exports = config[env];
