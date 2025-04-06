var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
var ObjectId = mongoose.Schema.Types.ObjectId;
var AdminSchema = mongoose.Schema({
  enrollment: {
    type: Number,
    index: true,
    unique: true,
  },
  department: {
    type: String,
  },
  semester: {
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
  password: {
    type: String,
  },
  gender: {
    type: String,
  },
  role: {
    type: String,
    default: "admin",
  },
});
var Admin = (module.exports = mongoose.model("Admin", AdminSchema));

module.exports.createUser = function (newUser, callback) {
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(newUser.password, salt, function (err, hash) {
      // Store hash in your password DB.
      newUser.password = hash;
      newUser.save().then((data) => callback(data));
    });
  });
};
module.exports.getUserByUsername = function (username, callback) {
  console.log("inside getuser admin");
  var query = { email: username };
  Admin.findOne(query, callback);
};

module.exports.comparePassword = function (candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
    // res === true
    console.log("comparepassword");
    if (err) throw err;
    callback(null, isMatch);
  });
};
module.exports.getUserById = function (id, callback) {
  console.log("getuserbyid admin");
  // console.log(User.findById(id).collection('users'));
  Admin.findById(id, callback);
};
