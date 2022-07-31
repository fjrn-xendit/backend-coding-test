const {
  createRideAccessor,
  getRidesPaginatedAccessor,
  getRideAccessor,
  getInsertedRideAccessor,
} = require('../accessor/rideAccessor');
const {logger} = require('../../../logger/logger');

const createRide = () => async (req, res) => {
  try {
    await createRideAccessor(
        req.body.start_lat,
        req.body.start_long,
        req.body.end_lat,
        req.body.end_long,
        req.body.rider_name,
        req.body.driver_name,
        req.body.driver_vehicle,
    );
    try {
      const rows = await getInsertedRideAccessor();
      res.send(rows);
    } catch (err) {
      logger.error(`Error inserting ride: ${err}`);
      return res.status(500).send({
        error_code: 'SERVER_ERROR',
        message: 'Unknown error',
      });
    }
  } catch (err) {
    logger.error(`Error inserting ride: ${err}`);
    return res.status(500).send({
      error_code: 'SERVER_ERROR',
      message: 'Unknown error',
    });
  }
};

const getRides = () => async (req, res) => {
  const page = req.query.page || 1;
  const pageSize = 10;
  const offset = (+page - 1) * pageSize;
  try {
    const rows = await getRidesPaginatedAccessor(pageSize, offset);
    if (rows.length === 0) {
      return res.status(404).send({
        error_code: 'RIDES_NOT_FOUND_ERROR',
        message: 'Could not find any rides',
      });
    }

    res.send(rows);
  } catch (err) {
    logger.error(`Error selecting ride: ${err}`);
    return res.status(500).send({
      error_code: 'SERVER_ERROR',
      message: 'Unknown error',
    });
  }
};

const getRide = () => async (req, res) => {
  try {
    const rows = await getRideAccessor(req.params.id);
    if (rows.length === 0) {
      return res.status(404).send({
        error_code: 'RIDES_NOT_FOUND_ERROR',
        message: 'Could not find any rides',
      });
    }

    res.send(rows);
  } catch (err) {
    logger.error(`Error selecting ride: ${err}`);
    return res.status(500).send({
      error_code: 'SERVER_ERROR',
      message: 'Unknown error',
    });
  }
};

module.exports.createRide = createRide();
module.exports.getRides = getRides();
module.exports.getRide = getRide();
