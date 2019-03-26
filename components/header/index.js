Header = function() {}

Header.prototype.name = 'header';
Header.prototype.view = __dirname;

Header.prototype.search = function(evt) {
  var self = this;
  var text = evt.target.value;

  if (text.length >= 3) {
    var request = require('superagent');
    request
    .get('/search')
    .query({ username: text })
    .end(function(err, res) {
      if (err) {
        console.log(err);
      } else {
        self.model.set('_page.results', res.body.hits);
      }
    });
  } else {
    self.model.del('_page.results');
  }
}

module.exports = Header