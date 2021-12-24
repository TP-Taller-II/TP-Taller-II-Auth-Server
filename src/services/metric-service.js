'use strict';

const StatsD = require('hot-shots');

const config = require('../../config/config');

const dogstatsd = new StatsD();

const incrementMetric = metricName => {
	if (config.metric.enabled) {
		dogstatsd.increment(metricName);
	}
};

const registerSignUpEmail = () => {
	incrementMetric('authserver.signup.email');
};

const registerSignUpGoogle = () => {
	incrementMetric('authserver.signup.google');
};

const registerSignInEmail = () => {
	incrementMetric('authserver.signin.email');
};

const registerSignInGoogle = () => {
	incrementMetric('authserver.signin.google');
};

module.exports = {
	registerSignUpEmail,
	registerSignUpGoogle,
	registerSignInEmail,
	registerSignInGoogle,
};
