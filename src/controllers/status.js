'use strict';

const STATUS_CODES = require('../utils/status-codes.json');

const startingDate = Date.now();

const getContract = async (req, res) => {
	res.status(STATUS_CODES.OK).send({
		status: 'Online',
		creationDate: startingDate.toFixed(),
		description: 'Microservicio de Servicio de Autenticacion, utilizando node y mongodb.',
	});
};

module.exports = getContract;
