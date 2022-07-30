'use strict';

const request = require('supertest');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

const app = require('../src/app')(db);
const buildSchemas = require('../src/schemas');

const {expect} = require('chai');

describe('API tests', () => {
  before((done) => {
    db.serialize((err) => {
      if (err) {
        return done(err);
      }

      buildSchemas(db);

      done();
    });
  });

  describe('GET /health', () => {
    it('should return health', (done) => {
      request(app)
          .get('/health')
          .expect('Content-Type', /text/)
          .expect(200, done);
    });
  });

  describe('GET /rides', () => {
    it('should return rides not found', (done) => {
      request(app)
          .get('/rides')
          .expect('Content-Type', /json/)
          .expect(404, done);
    });
  });

  describe('GET /rides/1', () => {
    it('should return ride not found', (done) => {
      request(app)
          .get('/rides/1')
          .expect('Content-Type', /json/)
          .expect(404, done);
    });
  });

  describe('POST /rides', () => {
    it('should return invalid startLatitude', (done) => {
      request(app)
          .post('/rides')
          .send({
            start_lat: '-91',
            start_long: '-180',
            end_lat: '-90',
            end_long: '-180',
            rider_name: 'John Doe',
            driver_name: 'Jane Doe',
            driver_vehicle: 'BMW',
          })
          .expect('Content-Type', /json/)
          .expect(400, done);
    });
  });

  describe('POST /rides', () => {
    it('should return invalid endLatitude', (done) => {
      request(app)
          .post('/rides')
          .send({
            start_lat: '-90',
            start_long: '-180',
            end_lat: '-91',
            end_long: '-180',
            rider_name: 'John Doe',
            driver_name: 'Jane Doe',
            driver_vehicle: 'BMW',
          })
          .expect('Content-Type', /json/)
          .expect(400, done);
    });
  });

  describe('POST /rides', () => {
    it('should return invalid driver name', (done) => {
      request(app)
          .post('/rides')
          .send({
            start_lat: '-90',
            start_long: '-180',
            end_lat: '-90',
            end_long: '-180',
            rider_name: 'John Doe',
            driver_name: '',
            driver_vehicle: 'BMW',
          })
          .expect('Content-Type', /json/)
          .expect(400, done);
    });
  });

  describe('POST /rides', () => {
    it('should return invalid driver vehicle', (done) => {
      request(app)
          .post('/rides')
          .send({
            start_lat: '-90',
            start_long: '-180',
            end_lat: '-90',
            end_long: '-180',
            rider_name: 'John Doe',
            driver_name: 'fajrin',
            driver_vehicle: '',
          })
          .expect('Content-Type', /json/)
          .expect(400, done);
    });
  });

  describe('POST /rides', () => {
    it('should return server error no lat/long provided', (done) => {
      request(app)
          .post('/rides')
          .send({
            start_lat: NaN,
            start_long: '-180',
            end_lat: '-90',
            end_long: '-180',
            rider_name: 'John Doe',
            driver_name: 'fajrin',
            driver_vehicle: 'BMW',
          })
          .expect('Content-Type', /json/)
          .expect(500, done);
    });
  });

  describe('POST /rides', () => {
    it('success creating rides', (done) => {
      request(app)
          .post('/rides')
          .send({
            start_lat: '-65',
            start_long: '-173',
            end_lat: '-27',
            end_long: '-180',
            rider_name: 'John Doe',
            driver_name: 'fajrin',
            driver_vehicle: 'BMW',
          })
          .expect('Content-Type', /json/)
          .expect(200, done)
          .then((res) => {
            expect(res.body[0].rideID).to.be.a('number');
            expect(res.body[0].startLat).to.deep.equal(-65);
            expect(res.body[0].startLong).to.deep.equal(-173);
            expect(res.body[0].endLat).to.deep.equal(-27);
            expect(res.body[0].endLong).to.deep.equal(-180);
            expect(res.body[0].riderName).to.deep.equal('John Doe');
            expect(res.body[0].driverName).to.deep.equal('fajrin');
            expect(res.body[0].driverVehicle).to.deep.equal('BMW');
          });
    });
  });

  describe('GET /rides', () => {
    it('should return rides found', (done) => {
      request(app)
          .get('/rides')
          .expect('Content-Type', /json/)
          .expect(200, done)
          .then((res) => {
            expect(res.body[0].rideID).to.be.a('number');
            expect(res.body[0].startLat).to.deep.equal(-65);
            expect(res.body[0].startLong).to.deep.equal(-173);
            expect(res.body[0].endLat).to.deep.equal(-27);
            expect(res.body[0].endLong).to.deep.equal(-180);
            expect(res.body[0].riderName).to.deep.equal('John Doe');
            expect(res.body[0].driverName).to.deep.equal('fajrin');
            expect(res.body[0].driverVehicle).to.deep.equal('BMW');
          });
    });
  });

  describe('GET /rides/1', () => {
    it('should return ride found', (done) => {
      request(app)
          .get('/rides/1')
          .expect('Content-Type', /json/)
          .expect(200, done)
          .then((res) => {
            expect(res.body[0].rideID).to.be.a('number');
            expect(res.body[0].startLat).to.deep.equal(-65);
            expect(res.body[0].startLong).to.deep.equal(-173);
            expect(res.body[0].endLat).to.deep.equal(-27);
            expect(res.body[0].endLong).to.deep.equal(-180);
            expect(res.body[0].riderName).to.deep.equal('John Doe');
            expect(res.body[0].driverName).to.deep.equal('fajrin');
            expect(res.body[0].driverVehicle).to.deep.equal('BMW');
          });
    });
  });
});
