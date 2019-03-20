var model = require('./model');

// function to generate a random number between 0 and max
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// create 10 random followers & following per user
var query = model.query('users', {});
query.fetch(function(err) {
  if (err) {
    console.log(err);
  } else {
    var users = query.get();
    // for each user
    for (var i = 0; i < users.length; i++) {
      // create followers
      for (var j = 0; j < 10; j++) {
        var k = getRandomInt(100);
        if (i == k) continue;
        var follower = {
          id: model.id(),
          user_id: users[i].id,
          follower_id: users[k].id
        };
        model.add('followers', follower);
      }

      // create following
      for (var j = 0; j < 10; j++) {
        var k = getRandomInt(100);
        if (i == k) continue;
        var follower = {
          id: model.id(),
          user_id: users[k].id,
          follower_id: users[i].id
        };
        model.add('followers', follower);
      }
    }
  }
})