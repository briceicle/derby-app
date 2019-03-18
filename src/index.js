var app = module.exports = require('derby').createApp('derby-app', __filename);
app.use(require('derby-debug'));
app.serverUse(module, 'derby-stylus');
app.use(require('d-bootstrap'));
app.loadViews(__dirname + '/../views');
app.loadStyles(__dirname + '/../styles');
app.component(require('d-before-unload'));

app.get('/', function(page, model) {
  page.render('login');
});