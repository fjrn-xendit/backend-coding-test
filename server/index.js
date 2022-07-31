'use strict';

const port = 8010;
const express = require('express');
const app = express();

const {logger} = require('../logger/logger');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

const riderRouter = require('../src/rides/router/rideRouter');

app.disable('x-powered-by');
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get('/health', (req, res) => res.send('Healthy'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/rides', riderRouter);

app.listen(port, () =>
  logger.info(`App started and listening on port ${port}`),
);

module.exports = app;
