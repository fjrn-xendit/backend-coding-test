const {logger} = require('../../../logger/logger');

const validateCreateRide = (req, res, next) => {
  const startLatitude = Number(req.body.start_lat);
  const startLongitude = Number(req.body.start_long);
  const endLatitude = Number(req.body.end_lat);
  const endLongitude = Number(req.body.end_long);
  const riderName = req.body.rider_name;
  const driverName = req.body.driver_name;
  const driverVehicle = req.body.driver_vehicle;

  if (
    startLatitude < -90 ||
    startLatitude > 90 ||
    startLongitude < -180 ||
    startLongitude > 180
  ) {
    logger.warn(`Invalid start latitude: ${startLatitude}`);
    return res.status(400).send({
      error_code: 'VALIDATION_ERROR',
      message: `Start latitude and longitude must be
        between -90 - 90 and -180 to 180 degrees respectively`,
    });
  }

  if (
    endLatitude < -90 ||
    endLatitude > 90 ||
    endLongitude < -180 ||
    endLongitude > 180
  ) {
    logger.warn(`Invalid end latitude: ${endLatitude}`);
    return res.status(400).send({
      error_code: 'VALIDATION_ERROR',
      message: `End latitude and longitude must be
        between -90 - 90 and -180 to 180 degrees respectively`,
    });
  }

  if (typeof riderName !== 'string' || riderName.length < 1) {
    logger.warn(`Invalid rider name: ${riderName}`);
    return res.status(400).send({
      error_code: 'VALIDATION_ERROR',
      message: 'Rider name must be a non empty string',
    });
  }

  if (typeof driverName !== 'string' || driverName.length < 1) {
    logger.warn(`Invalid driver name: ${driverName}`);
    return res.status(400).send({
      error_code: 'VALIDATION_ERROR',
      message: 'Rider name must be a non empty string',
    });
  }

  if (typeof driverVehicle !== 'string' || driverVehicle.length < 1) {
    logger.warn(`Invalid driver vehicle: ${driverVehicle}`);
    return res.status(400).send({
      error_code: 'VALIDATION_ERROR',
      message: 'Rider name must be a non empty string',
    });
  }
  next();
};

const validateGetRides = (req, res, next) => {
  const page = req.query.page || 1;

  if (typeof page !== 'string' || isNaN(+page) || +page < 1) {
    const error = {
      error_code: 'VALIDATION_ERROR',
      message: 'Invalid page number',
    };
    logger.warn(`Invalid page number ${page}`);
    return res.status(400).send(error);
  }

  next();
};

const validateGetRide = (req, res, next) => {
  const rideID = req.params.id;
  if (typeof rideID !== 'string' || isNaN(+rideID) || +rideID < 1) {
    const error = {
      error_code: 'VALIDATION_ERROR',
      message: 'Invalid ride ID',
    };
    logger.warn(`Invalid ride ID ${rideID}`);
    return res.status(400).send(error);
  }

  next();
};

const validateWhitelistedIP = (req, res, next) => {
  const validIPs = ['127.0.0.1', '::ffff:127.0.0.1', '::1'];
  const ip = req.ip;
  if (!validIPs.includes(ip)) {
    const error = {
      error_code: 'VALIDATION_ERROR',
      message: 'Unauthorized',
    };
    logger.warn(`unauthorized access from ${ip}`);
    return res.status(401).send(error);
  }

  next();
};

module.exports.validateCreateRide = validateCreateRide;
module.exports.validateGetRides = validateGetRides;
module.exports.validateGetRide = validateGetRide;
module.exports.validateWhitelistedIP = validateWhitelistedIP;
