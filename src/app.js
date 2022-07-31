'use strict';

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

const {logger} = require('../logger/logger');

module.exports = (db) => {
  app.get('/health', (req, res) => res.send('Healthy'));

  app.post('/rides', jsonParser, (req, res) => {
    const startLatitude = Number(req.body.start_lat);
    const startLongitude = Number(req.body.start_long);
    const endLatitude = Number(req.body.end_lat);
    const endLongitude = Number(req.body.end_long);
    const riderName = req.body.rider_name;
    const driverName = req.body.driver_name;
    const driverVehicle = req.body.driver_vehicle;

    if (startLatitude < -90 ||
        startLatitude > 90 ||
        startLongitude < -180 ||
        startLongitude > 180) {
      logger.warn(`Invalid start latitude: ${startLatitude}`);
      return res.status(400).send({
        error_code: 'VALIDATION_ERROR',
        message: `Start latitude and longitude must be
        between -90 - 90 and -180 to 180 degrees respectively`,
      });
    }

    if (endLatitude < -90 ||
        endLatitude > 90 ||
        endLongitude < -180 ||
        endLongitude > 180) {
      logger.warn(`Invalid end latitude: ${endLatitude}`);
      return res.status(400).send({
        error_code: 'VALIDATION_ERROR',
        message: `End latitude and longitude must be
        between -90 - 90 and -180 to 180 degrees respectively`,
      });
    }

    if (typeof riderName !== 'string'||
        riderName.length < 1) {
      logger.warn(`Invalid rider name: ${riderName}`);
      return res.status(400).send({
        error_code: 'VALIDATION_ERROR',
        message: 'Rider name must be a non empty string',
      });
    }

    if (typeof driverName !== 'string' ||
        driverName.length < 1) {
      logger.warn(`Invalid driver name: ${driverName}`);
      return res.status(400).send({
        error_code: 'VALIDATION_ERROR',
        message: 'Rider name must be a non empty string',
      });
    }

    if (typeof driverVehicle !== 'string' ||
        driverVehicle.length < 1) {
      logger.warn(`Invalid driver vehicle: ${driverVehicle}`);
      return res.status(400).send({
        error_code: 'VALIDATION_ERROR',
        message: 'Rider name must be a non empty string',
      });
    }

    const values = [req.body.start_lat, req.body.start_long,
      req.body.end_lat, req.body.end_long, req.body.rider_name,
      req.body.driver_name, req.body.driver_vehicle];
    db.run(`INSERT INTO Rides(startLat, startLong, endLat,
        endLong, riderName, driverName, driverVehicle)
        VALUES (?, ?, ?, ?, ?, ?, ?)`, values, function(err) {
      if (err) {
        logger.error(`Error inserting ride: ${err}`);
        return res.status(500).send({
          error_code: 'SERVER_ERROR',
          message: 'Unknown error',
        });
      }

      db.all('SELECT * FROM Rides WHERE rideID = ?',
          this.lastID, function(err, rows) {
            logger.error(`Error selecting ride: ${err}`);
            if (err) {
              return res.status(500).send({
                error_code: 'SERVER_ERROR',
                message: 'Unknown error',
              });
            }

            res.send(rows);
          });
    });
  });

  app.get('/rides', (req, res) => {
    const page = req.query.page || 1;
    const pageSize = 10;

    if (
      isNaN(+page) ||
      +page < 1
    ) {
      const error = {
        error_code: 'VALIDATION_ERROR',
        message: 'Invalid page number',
      };
      logger.warn(`Invalid page number ${page}`);
      return res.status(400).send(error);
    }

    const offset = (+page - 1) * pageSize;

    db.all(`SELECT * FROM Rides
      ORDER BY rideID
      ASC LIMIT ${pageSize}
      OFFSET ${offset}`,
    function(err, rows) {
      if (err) {
        logger.error(`Error selecting rides: ${err}`);
        return res.status(500).send({
          error_code: 'SERVER_ERROR',
          message: 'Unknown error',
        });
      }

      if (rows.length === 0) {
        return res.status(404).send({
          error_code: 'RIDES_NOT_FOUND_ERROR',
          message: 'Could not find any rides',
        });
      }

      res.send(rows);
    });
  });

  app.get('/rides/:id', (req, res) => {
    db.all(`SELECT * FROM Rides WHERE rideID='${req.params.id}'`,
        function(err, rows) {
          if (err) {
            logger.error(`Error selecting ride: ${err}`);
            return res.status(500).send({
              error_code: 'SERVER_ERROR',
              message: 'Unknown error',
            });
          }

          if (rows.length === 0) {
            return res.status(404).send({
              error_code: 'RIDES_NOT_FOUND_ERROR',
              message: 'Could not find any rides',
            });
          }

          res.send(rows);
        });
  });

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  return app;
};
