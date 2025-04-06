var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
var ObjectId = mongoose.Schema.Types.ObjectId;
//User schema
var UserSchema = mongoose.Schema({
  enrollment: {
    type: Number,
    index: true,
    unique: true,
  },
  rollno: {
    type: Number,
  },
  name: {
    type: String,
  },
  mobile: {
    type: Number,
  },
  email: {
    type: String,
    index: true,
    unique: true,
  },
  pemail: {
    type: String,
  },
  password: {
    type: String,
  },
  semester: {
    type: String,
  },
  department: {
    type: String,
  },
  gender: {
    type: String,
  },
});
var User = (module.exports = mongoose.model("User", UserSchema));

module.exports.createUser = function (newUser, callback) {
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(newUser.password, salt, function (err, hash) {
      // Store hash in your password DB.
      newUser.password = hash;
      newUser.save().then((data) => callback && callback(data));
    });
  });
};
module.exports.getUserByUsername = function (username, callback) {
  console.log("inside getuser");
  var query = { email: username };
  User.findOne(query)
    .then((data) => {
      callback(null, data);
    })
    .catch((error) => {
      callback(error, null);
    });
};

module.exports.comparePassword = function (candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
    // res === true
    //console.log('comparepassword');
    if (err) throw err;
    callback(null, isMatch);
  });
};
module.exports.getUserById = function (id, callback) {
  //console.log('getuserbyid');
  // console.log(User.findById(id).collection('users'));
  User.findById(id)
    .then((data) => {
      callback(null, data);
    })
    .catch((error) => {
      callback(error, null);
    });
};
