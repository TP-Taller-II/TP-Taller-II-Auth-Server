'use strict';

// This line must come before importing any instrumented module.
require('dd-trace').init();

const Express = require('express');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const firebaseAdmin = require('firebase-admin');

const routes = require('./routes/index');
require('./startup/startup-mongo')();
const options = require('../documentation/options');
const logger = require('./helpers/logger');

firebaseAdmin.initializeApp({
	credential: firebaseAdmin.credential.applicationDefault(),
	databaseURL: 'https://ubademy-18397-default-rtdb.firebaseio.com',
});

const app = new Express();

app.use(cors());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(options));
app.use('/auth-server/v1', routes);

const port = process.env.PORT || 8080;

app.listen(port, () => logger.info(`App listening on port ${port}`));

module.exports = app;
