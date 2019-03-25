Header = function() {}

Header.prototype.name = 'header';
Header.prototype.view = __dirname;

Header.prototype.search = function(evt) {
  var text = evt.target.value;
  console.log(text);
}

module.exports = Header