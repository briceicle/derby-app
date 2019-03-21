var app = module.exports = require('derby').createApp('derby-app', __filename);
app.use(require('derby-debug'));
app.use(require('derby-login/components/notAuth'));
app.use(require('../components'));
app.serverUse(module, 'derby-stylus');

app.loadViews(__dirname + '/../views');
app.loadStyles(__dirname + '/../styles');

app.component(require('d-before-unload'));


app.get('*', function(page, model, params, next) {
  // fake user logged in by setting the first user record in DB
  var userQuery = model.query('users', {});
  userQuery.fetch(function(err) {
    if (err) {
      console.log(err);
      next(err);
    } else {
      if (userQuery.get().length == 0) return next();
      var userId = userQuery.get()[0].id;
      var user = model.at('users.' + userId);
      model.subscribe(user, function() {
        model.set('_session.loggedIn', true);
        model.ref('_session.user', user);
        next();
      });
    }
  });
});

app.get('/', function(page, model, params, next) {
  var userId = model.get('_session.user').id;
  var posts = model.query('posts', {user_id: userId});

  posts.subscribe(function(err) {
    if (err) return next(err);
    model.ref('_page.posts', posts);
    page.render('home');
  });
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