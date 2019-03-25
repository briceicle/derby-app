
module.exports = function(app) {
  app.component(require('./header'));
  app.component(require('./home'));
  app.component(require('./post'));
  app.component(require('./profile'));
};