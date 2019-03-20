var model = require('./model');
var faker = require('faker');
var async = require('async');

// function to generate a random number between 0 and max
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

var arr = [];
for (var i = 0; i < 20; i++) {
  arr.push(i);
}

// create 20 random posts per user
var query = model.query('users', {});
query.fetch(function(err) {
  if (err) {
    console.log(err);
  } else {
    var users = query.get();
    // for each user
    async.each(users, function(user, callback) {
      // create 20 posts
      async.each(arr, function(index, cb) {
        var post = {
          id: model.id(),
          user_id: user.id,
          type: 'picture',
          source_url: faker.image.imageUrl(),
          likes: null,
          comments: null
        };
        model.add('posts', post, function(err) {
          cb(err);
        });
      }, function(err) {
        callback(err);
      });
    }, function(err) {
      var code = 0;
      if (err) {
        code = 1;
        console.log(err);
      }
      process.exit(code);
    });
  }
});