'use strict';

const winston = require('winston');

const options = {
	level: 'info',
	handle_exceptions: true,
	colorize: true,
	silent: false,
	timestamp: true,
	pretty_print: true,
	label: '',
	levels: {
		debug: 0,
		info: 1,
		warn: 2,
		error: 3,
	},
	colors: {
		debug: 'white',
		info: 'grey',
		notice: 'green',
		warn: 'yellow',
		error: 'red',
		crit: 'blue',
		alert: 'magenta',
		emerg: 'cyan',
	},
};

// function logger() {
// 	// eslint-disable-next-line no-shadow,global-require
//
//
// 	// Console logger
// 	innerLogger.remove(innerLogger.transports.Console);
// 	innerLogger.add(innerLogger.transports.Console, {
// 		level: 'info',
// 		levels: options.levels,
// 		handleExceptions: true,
// 		colorize: options.colorize,
// 		timestamp: true,
// 		prettyPrint: true,
// 		label: options.label,
// 	});
//
// 	// Syslog logger
// 	if (options.syslog) {
// 		innerLogger.info('adding syslog transport');
// 		if (!options.syslog.added) {
// 			options.syslog.added = true;
// 			/* eslint-disable */
//       require('winston-syslog').Syslog;
//       innerLogger.add(innerLogger.transports.Syslog, options.syslog);
//       /* eslint-enable */
// 		}
// 	}
//
// 	innerLogger.stream = {
// 		write(message) {
// 			innerLogger.info(message);
// 		},
// 	};
//
// 	// Log levels and colors
// 	innerLogger.setLevels(options.levels);
// 	innerLogger.addColors(options.colors);
//
// 	return innerLogger;
// }();


// eslint-disable-next-line new-cap
const logger = new winston.createLogger({
	transports: [
		new winston.transports.Console(options),
	],
	exitOnError: false, // do not exit on handled exceptions
});

logger.stream = {
	write(message) {
		// use the 'info' log level so the output will be picked up by both transports (file and console)
		logger.info(message);
	},
};

module.exports = logger;
