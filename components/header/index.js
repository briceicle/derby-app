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
        var results = res.body.hits.map(function(item) {
          return item._source;
        });
        self.model.root.set('_page.searchResults', results);
      }
    });
  } else {
    self.model.root.del('_page.searchResults');
  }
}

module.exports = Header