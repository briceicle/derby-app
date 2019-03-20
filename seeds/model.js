require('dotenv').config();

var derby = require('derby');
var ShareDbMongo = require('sharedb-mongo');
var mongoUrl = process.env.MONGO_URL || process.env.MONGODB_URI;
var backend = derby.createBackend({
  db: new ShareDbMongo(mongoUrl),
});
var model = backend.createModel();

module.exports = model;