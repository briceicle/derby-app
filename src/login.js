module.exports = {
  collection: 'auths',
  publicCollection: 'users',
  user: {
    id: true,
    email: true,
  },
  passport: {},
  strategies: {
    local: {
      strategy: require('passport-local').Strategy,
      conf: {}
    }
  },
  loginUrl: '/login',
  registerUrl: '/register',
  hooks: {
    request: function(req, res, userId, isAuthenticated, done) {
      // Redirect all unAuth GET requests to loginUrl
      if (!isAuthenticated && req.method === 'GET' &&
          req.url !== this.options.confirmRegistrationUrl &&
          req.url !== this.options.loginUrl &&
          req.url !== this.options.registerUrl &&
          req.url !== this.options.registrationConfirmedUrl &&
          req.url.indexOf(this.options.recoverPasswordUrl) !== 0 &&
          req.url.indexOf('/auth/') !== 0) {
        return res.redirect(this.options.loginUrl);
      }
      done();
    }
  }
}