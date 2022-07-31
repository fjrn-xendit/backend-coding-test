const express = require('express');

const service = require('../service/rideService');
const validator = require('../validator/rideValidator');

const router = express.Router();

router
    .route('/')
    .post(validator.validateCreateRide, service.createRide)
    .get(validator.validateGetRides, service.getRides);

router.route('/:id').get(service.getRide);

module.exports = router;
