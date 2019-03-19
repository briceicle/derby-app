var app = module.exports = require('derby').createApp('derby-app', __filename);
app.use(require('derby-debug'));
app.use(require('d-bootstrap'));
app.serverUse(module, 'derby-stylus');

app.loadViews(__dirname + '/../views');
app.loadStyles(__dirname + '/../styles');

app.component(require('d-before-unload'));
app.component(require('derby-login/components/login'));
app.component(require('derby-login/components/register'));


app.get('*', function(page, model, params, next) {
  if (model.get('_session.loggedIn')) {
    var userId = model.get('_session.userId');
    var user = model.at('auths.' + userId);
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

app.get('/register', function(page, model, params, next) {
  page.render('register');
});

app.get('/confirmregistration', function(page, model, params, next) {
  page.render('confirmregistration');
});