var coffeeify = require('coffeeify');
var compression = require('compression')
var derby = require('derby');
var express = require('express');
var favicon = require('serve-favicon')
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var highway = require('racer-highway');
var ShareDbMongo = require('sharedb-mongo');

derby.use(require('racer-bundle'));

function setup(app, cb) {
  var mongoUrl =
    process.env.MONGO_URL ||
    process.env.MONGOHQ_URL ||
    'mongodb://' +
      (process.env.MONGO_HOST || 'localhost') + ':' +
      (process.env.MONGO_PORT || 27017) + '/' +
      (process.env.MONGO_DB || 'derby-' + (app.name || 'app'));

  var backend = derby.createBackend({
    db: new ShareDbMongo(mongoUrl)
  });

  backend.on('bundle', function(browserify) {
    // Add support for directly requiring coffeescript in browserify bundles
    browserify.transform(coffeeify);
  });

  var publicDir = __dirname + '/public';

  var handlers = highway(backend);

  var expressApp = express()
    .use(favicon(publicDir + '/favicon.ico'))
    // Gzip dynamically rendered content
    .use(compression())
    .use(express.static(publicDir))

  expressApp
    // Adds req.model
    .use(backend.modelMiddleware())
    .use(session({
      secret: process.env.SESSION_SECRET || 'YOUR SECRET HERE'
    , store: new MongoStore({url: mongoUrl})
    , resave: true
    , saveUninitialized: false
    }))
    .use(handlers.middleware)
    .use(createUserId)

  expressApp
    // Creates an express middleware from the app's routes
    .use(app.router())
    .use(errorMiddleware)

  expressApp.all('*', function(req, res, next) {
    next('404: ' + req.url);
  });

  cb(null, expressApp, handlers.upgrade);
}

function createUserId(req, res, next) {
  var userId = req.session.userId;
  if (!userId) userId = req.session.userId = req.model.id();
  req.model.set('_session.userId', userId);
  next();
}

var errorApp = derby.createApp();
errorApp.serverUse(module, 'derby-stylus');
errorApp.loadViews(__dirname + '/views/error');
errorApp.loadStyles(__dirname + '/styles/reset');
errorApp.loadStyles(__dirname + '/styles/error');

function errorMiddleware(err, req, res, next) {
  if (!err) return next();

  var message = err.message || err.toString();
  var status = parseInt(message);
  status = ((status >= 400) && (status < 600)) ? status : 500;

  if (status < 500) {
    console.log(err.message || err);
  } else {
    console.log(err.stack || err);
  }

  var page = errorApp.createPage(req, res, next);
  page.renderStatic(status, status.toString());
}

var port = process.env.PORT || 3000;

function listenCallback() {
  console.log('%d listening. Go to: http://localhost:%d/', process.pid, port);
}
function createServer() {
  var app = require('./index.js');
  setup(app, function(err, expressApp, upgrade) {
    if (err) throw err;
    var server = require('http').createServer(expressApp);
    server.on('upgrade', upgrade);
    server.listen(port, listenCallback);
  });
}

derby.run(createServer);