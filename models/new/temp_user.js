var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
var ObjectId = mongoose.Schema.Types.ObjectId;
//User schema
var TempUserSchema = mongoose.Schema({
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
    default: null,
  },
});
var TempUser = (module.exports = mongoose.model("TempUser", TempUserSchema));

module.exports.createUser = function (newUser, callback) {
  newUser.save().then((data) => callback(data));
  /*bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            // Store hash in your password DB.
            newUser.password=hash;
            newUser.save().then((data) => callback(data));
        });
    });*/
};
// module.exports.getUserByUsername=function(username,callback){
//     console.log('inside getuser user');
//     var query={email:username};
//     User.findOne(query,callback);
// };

// module.exports.comparePassword=function(candidatePassword,hash,callback){
//     bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
//         // res === true
//         console.log('comparepassword');
//         if(err) throw err;
//         callback(null,isMatch);
//     });
// };
// module.exports.getUserById=function(id,callback){
//     console.log('getuserbyid');
//    // console.log(User.findById(id).collection('users'));
//     User.findById(id,callback);
// };
