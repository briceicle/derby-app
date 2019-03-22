Post = function() {}

Post.prototype.name = 'post';
Post.prototype.view = __dirname;

Post.prototype.init = function(model) {
}

Post.prototype.create = function(model) {
  var userId = model.get('post').user_id;
  var user = model.root.at('users.' + userId);

  user.subscribe(function(err) {
    if (err) console.log(err);
    model.ref('user', user);
  });
}

Post.prototype.select = function(evt) {
}

module.exports = Post