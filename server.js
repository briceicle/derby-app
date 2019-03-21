require('dotenv').config();

var coffeeify = require('coffeeify');
var compression = require('compression')
var derby = require('derby');
var express = require('express');
var favicon = require('serve-favicon')
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var highway = require('racer-highway');
var ShareDbMongo = require('sharedb-mongo');
var RedisClient = require('redis').createClient(process.env.REDIS_URL)
var RedisPubSub = require('sharedb-redis-pubsub');
var derbyLogin = require('derby-login');
var bodyParser = require('body-parser');

derby.use(require('racer-bundle'));

function setup(app, cb) {
  var backend, expressApp, handlers;
  var publicDir = __dirname + '/public';
  var mongoUrl = process.env.MONGO_URL || process.env.MONGODB_URI;

  var backend = derby.createBackend({
    db: new ShareDbMongo(mongoUrl),
    pubsub: new RedisPubSub({client: RedisClient})
  });

  backend.on('bundle', function(browserify) {
    browserify.transform(coffeeify);
  });

  backend.addProjection('following', 'followers', {
    user_id: true
  });

  handlers = highway(backend);

  expressApp = express()
    .use(favicon(publicDir + '/favicon.ico'))
    .use(compression())
    .use(express.static(publicDir))
    .use(backend.modelMiddleware())
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({extended: true}))
    .use(session({
      secret: process.env.SESSION_SECRET,
      store: new MongoStore({url: mongoUrl}),
      resave: true,
      saveUninitialized: false
    }))
    .use(handlers.middleware)
    .use(app.router())
    .use(errorMiddleware)

  expressApp.all('*', function(req, res, next) {
    console.log(req.url, req.method, req.body);
    next('404: ' + req.url);
  });

  app.writeScripts(backend, publicDir, {extensions: ['.coffee']}, function(err) {
    cb(err, expressApp, handlers.upgrade);
  });
}

var errorApp = derby.createApp();
errorApp.serverUse(module, 'derby-stylus');
errorApp.loadViews(__dirname + '/views/errors/error');
errorApp.loadStyles(__dirname + '/styles/errors/reset');
errorApp.loadStyles(__dirname + '/styles/errors/error');

function errorMiddleware(err, req, res, next) {
  if (err) {
    var message = err.message || err.toString();
    var status = parseInt(message);
    var page = errorApp.createPage(req, res, next);

    console.log(err.message, err.stack);
    page.renderStatic(status, status.toString());
  } else {
    return next();
  }
}

function run(options, cb) {
  var app = require('./src/index');
  var port = options.port || process.env.PORT || 3000;

  function listenCallback(err) {
    console.log('%d listening. Go to: http://localhost:%d/', process.pid, port);
    cb && cb(err);
  }
  function createServer() {
    setup(app, function(err, expressApp, upgrade) {
      if (err) throw err;
      var server = require('http').createServer(expressApp);
      server.on('upgrade', upgrade);
      server.listen(port, listenCallback);
    });
  }
  derby.run(createServer);
}

run({port: process.env.PORT});