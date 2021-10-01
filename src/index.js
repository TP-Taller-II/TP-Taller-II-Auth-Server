'use strict';

const Express = require('express');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const routes = require('./routes/index');
// !!!! require('./startup/startup-mongo')();

const options = require('../documentation/options');

const app = new Express();

// app.use(cors({
// 	origin: 'https://grupo0.tecnicasdedisenio.com.ar',
// }));
app.use(cors());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(options));
app.use('/api', routes);

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`App listening on port ${port}`));

module.exports = app;
