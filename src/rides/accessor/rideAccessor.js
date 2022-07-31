const db = require('../../models/load');

const createRide = (
    startLat,
    startLong,
    endLat,
    endLong,
    riderName,
    driverName,
    driverVehicle,
) =>
  new Promise((resolve, reject) => {
    db.run(
        `INSERT INTO Rides(startLat, startLong, endLat,
        endLong, riderName, driverName, driverVehicle)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          startLat,
          startLong,
          endLat,
          endLong,
          riderName,
          driverName,
          driverVehicle,
        ],
        (err, row) => {
          if (err) {
            reject(err);
          }
          resolve(row);
        },
    );
  });

const getRidesPaginated = (pageSize, offset) =>
  new Promise((resolve, reject) => {
    db.all(
        'SELECT * FROM Rides ORDER BY rideID ASC LIMIT ? OFFSET ?',
        [pageSize, offset],
        (err, row) => {
          if (err) {
            reject(err);
          }
          resolve(row);
        },
    );
  });

const getRide = (id) =>
  new Promise((resolve, reject) => {
    db.all('SELECT * FROM Rides WHERE rideID = ?', id, (err, row) => {
      if (err) {
        reject(err);
      }
      resolve(row);
    });
  });

const getInsertedRide = () =>
  new Promise((resolve, reject) => {
    db.all(
        'SELECT * FROM Rides ORDER BY rowid DESC LIMIT 1',
        [],
        (err, row) => {
          if (err) {
            reject(err);
          }
          resolve(row);
        },
    );
  });

module.exports.createRideAccessor = createRide;
module.exports.getRidesPaginatedAccessor = getRidesPaginated;
module.exports.getRideAccessor = getRide;
module.exports.getInsertedRideAccessor = getInsertedRide;
