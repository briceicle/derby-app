var app = module.exports = require('derby').createApp('derby-app', __filename);
app.use(require('derby-debug'));
app.serverUse(module, 'derby-stylus');
app.use(require('d-bootstrap'));
app.loadViews(__dirname + '/../views');
app.loadStyles(__dirname + '/../styles');
app.component(require('d-before-unload'));

app.get('*', function(page, model, params, next) {
  if (model.get('_session.loggedIn')) {
    var userId = model.get('_session.userId');
    var user = model.at('users.' + userId);
    model.subscribe(user, function() {
      model.ref('_session.user', user);
      next();
    });
  } else {
    next();
  }
});

app.get('/', function(page, model, params, next) {
  page.render('home');
});

app.get('/login', function(page, model, params, next) {
  page.render('login');
});

app.post('/login', function(page, model, params, next) {
  console.log('/login', params.body);
  page.render('home');
});