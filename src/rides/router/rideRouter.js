const express = require('express');

const service = require('../service/rideService');
const validator = require('../validator/rideValidator');

const router = express.Router();

router
    .route('/')
    .post(
        validator.validateWhitelistedIP,
        validator.validateCreateRide,
        service.createRide,
    )
    .get(
        validator.validateWhitelistedIP,
        validator.validateGetRides,
        service.getRides,
    );

router
    .route('/:id')
    .get(
        validator.validateWhitelistedIP,
        validator.validateGetRide,
        service.getRide,
    );

module.exports = router;
