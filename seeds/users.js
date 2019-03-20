var model = require('./model');
var faker = require('faker');
var async = require('async');

var arr = [];
for (var i = 0; i < 100; i++) {
  arr.push(i);
}

// create 100 random users
async.each(arr, function(index, callback) {
  var user = {
    id: model.id(),
    avatar: faker.image.avatar(),
    name: faker.name.findName(),
    username: faker.internet.userName(),
    password: faker.internet.password(),
    website: faker.internet.url(),
    bio: faker.lorem.paragraph(),
    email: faker.internet.email(),
    phone_number: faker.phone.phoneNumber()
  };
  model.add('users', user, function(err) {
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