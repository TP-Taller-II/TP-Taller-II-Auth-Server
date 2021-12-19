'use strict';

const Express = require('express');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const firebaseAdmin = require('firebase-admin');

const routes = require('./routes/index');
require('./startup/startup-mongo')();
const options = require('../documentation/options');

const app = new Express();

app.use(cors());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(options));
app.use('/auth-server/v1', routes);

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`App listening on port ${port}`));

firebaseAdmin.initializeApp({
	credential: firebaseAdmin.credential.applicationDefault(),
	databaseURL: 'https://ubademy-18397-default-rtdb.firebaseio.com',
});


module.exports = app;
