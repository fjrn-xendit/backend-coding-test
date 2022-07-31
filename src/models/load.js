const sqlite3 = require('sqlite3').verbose();
const buildSchemas = require('./schemas');

const db = new sqlite3.Database(':memory:');
db.serialize(() => buildSchemas(db));

module.exports = db;
