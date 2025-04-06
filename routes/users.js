var express = require("express");
var router = express.Router();
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
const { MongoClient, ObjectID } = require("mongodb");
var User = require("../models/user");
var Request = require("../models/attendancerequest");
var Log = require("../models/attendancelog");
var studentAttendance = require("../models/student_attendance");
var workingDays = require("../models/days.js");
var nodemailer = require("nodemailer");

var bcrypt=require('bcryptjs');

var arr = [];
var arr1 = [];
const url = "mongodb://localhost/attendance";

var io = require("socket.io")(4800);

const accessToken =
  "pk.eyJ1IjoiZGFya3JhaTE5IiwiYSI6ImNqcHdvOTBnYTBoamg0NHFscjY4MWM5d2cifQ.TTBp3QZuSBuXKzCmsCN7MA";
var id;
var data;
var local;
var req_validation = 0;
var requester_id;

router.get("/add", function (req, res) {
  res.render("add");
});
router.get("/register", nocache, ensureAuthenticated, function (req, res) {
  res.render("register");
});

router.get("/home", nocache, ensureAuthenticated1, function (req, res) {
  Log.find({ enrollment: req.user.enrollment }).then((docs) => {
    if (docs) {
      res.render("home", { arr: docs });
    }
  });
});
router.get(
  "/change_password",
  nocache,
  ensureAuthenticated1,
  function (req, res) {
    try {
      res.render("changepassword");
    } catch (err) {
      console.log(err);
    }
  }
);
router.post(
  "/change_password",
  nocache,
  ensureAuthenticated1,
  function (req, res) {
    var currentPassword = req.body.current;
    var newPassword = req.body.new;
    //console.log(currentPassword);
    //console.log(newPassword);
    if (currentPassword == null || newPassword == null) {
      res.send("Sorry.....");
    } else {
      if (currentPassword.length < 8 || newPassword.length < 8) {
        req.flash("error_msg", "password length should be greater than 8");
        res.redirect("/users/register");
      } else {
        if (req.user.role == "admin") {
          Admin.getUserByUsername(
            req.user.email.toString(),
            function (err, user) {
              console.log("inside getuserbyname");
              if (err) throw err;

              if (!user) {
                res.send("Unknown User");
              }
              Admin.comparePassword(
                currentPassword,
                user.password,
                function (err, isMatch) {
                  if (err) throw err;
                  if (isMatch) {
                    bcrypt.genSalt(10, function (err, salt) {
                      bcrypt.hash(
                        newPassword.toString(),
                        salt,
                        function (err, hash) {
                          // Store hash in your password DB.
                          newPassword = hash;
                          Admin.updateOne(
                            { _id: req.user._id },
                            { $set: { password: newPassword } }
                          ).then((docs) => {
                            req.flash("success_msg", "Password Changed");
                            res.redirect("/users/profile");
                          });
                        }
                      );
                    });
                  } else {
                    req.flash("error_msg", "Invalid Password");
                    res.redirect("/users/change_password");
                  }
                }
              );
            }
          );
        } else {
          User.getUserByUsername(
            req.user.email.toString(),
            function (err, user) {
              // console.log('inside getuserbyname');
              if (err) throw err;

              if (!user) {
                res.send("Unknown User");
              }
              User.comparePassword(
                currentPassword,
                user.password,
                function (err, isMatch) {
                  if (err) throw err;
                  if (isMatch) {
                    bcrypt.genSalt(10, function (err, salt) {
                      bcrypt.hash(
                        newPassword.toString(),
                        salt,
                        function (err, hash) {
                          // Store hash in your password DB.
                          newPassword = hash;
                          User.updateOne(
                            { _id: req.user._id },
                            { $set: { password: newPassword } }
                          ).then((docs) => {
                            req.flash("success_msg", "Password Changed");
                            res.redirect("/users/profile");
                          });
                        }
                      );
                    });
                  } else {
                    req.flash("error_msg", "Invalid Password");
                    res.redirect("/users/change_password");
                  }
                }
              );
            }
          );
        }
      }
    }
  }
);
router.get("/edit_profile", nocache, ensureAuthenticated1, function (req, res) {
  try {
    if (req.user.role == "admin") {
      Admin.findById({ _id: req.user._id }).then((docs) => {
        res.render("editprofile", { data: docs });
      });
    } else {
      User.findById({ _id: req.user._id }).then((docs) => {
        res.render("editprofile", { data: docs });
      });
    }
  } catch (err) {
    console.log(err);
  }
});
router.post(
  "/edit_profile",
  nocache,
  ensureAuthenticated1,
  function (req, res) {
    try {
      var enroll = req.body.enroll;
      var semester = req.body.semester;
      var department = req.body.department;
      var name = req.body.name;
      var mobile = req.body.mobile;
      var email = req.body.email;
      var gender = req.body.gender;
      if (
        enroll == null ||
        semester == null ||
        department == null ||
        name == null ||
        mobile == null ||
        email == null ||
        gender == null
      ) {
        res.send("Sorry!!!!!!!!!!!");
      } else {
        if (mobile.length != 10) {
          req.flash("error_msg", "Invalid mobile number");
          res.redirect("/users/edit_profile");
        } else {
          if (req.user.role == "admin") {
            Admin.updateOne(
              { _id: req.user._id },
              {
                $set: {
                  enrollment: enroll,
                  semester: semester,
                  department: department,
                  name: name,
                  mobile: mobile,
                  email: email,
                  gender: gender,
                },
              }
            ).then((docs) => {
              req.flash("success_msg", "Profile Updated");
              res.redirect("/users/profile");
            });
          } else {
            User.updateOne(
              { _id: req.user._id },
              {
                $set: {
                  enrollment: enroll,
                  semester: semester,
                  department: department,
                  name: name,
                  mobile: mobile,
                  email: email,
                  gender: gender,
                },
              }
            ).then((docs) => {
              req.flash("success_msg", "Profile Updated");
              res.redirect("/users/profile");
            });
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
);

router.get("/profile", nocache, ensureAuthenticated1, function (req, res) {
  try {
    if (req.user.role == "admin") {
      User.findById({ _id: req.user._id }).then((docs) => {
        if (docs == undefined || docs == null) {
          Admin.findById({ _id: req.user._id }).then((doc) => {
            res.render("profile", { data: doc });
          });
        } else {
          res.render("profile", { data: docs });
        }
      });
    } else {
      User.findById({ _id: req.user._id }).then((docs) => {
        res.render("profile", { data: docs });
      });
    }
  } catch (err) {
    console.log(err);
  }
});

router.get("/login", nocache, ensureAuthenticated, function (req, res) {
  res.render("login");
});

router.get(
  "/attendance_request",
  nocache,
  ensureAuthenticated1,
  function (req, res) {
    Request.find({ StudentID: req.user._id }).then((docs) => {
      //console.log(docs);
      res.render("attendancerequests", { arr: docs });
    });
  }
);

router.post("/accept_request", function (req, res) {
  var id = req.body.id;
  Request.updateOne({ _id: id }, { $set: { status: "Done" } }).then(
    (docs, err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Updated");
        var enrollment = req.body.enroll;
        var name = req.body.name;
        console.log("working enrollment:" + enrollment);
        console.log("working name:" + name);
        var date = new Date();
        var currentDate =
          date.getFullYear().toString() +
          "-" +
          (date.getMonth() + 1).toString() +
          "-" +
          date.getDate().toString();
        studentAttendance
          .find({ enrollment: enrollment })
          .limit(1)
          .then((docs) => {
            if (docs.length == 0) {
              //console.log('in new attend save if');
              var month = new Date(currentDate).getMonth() + 1;
              var studentSchema = new studentAttendance({
                enrollment: enrollment,
                name: name,
                [month]: 1,
                all: 1,
                last_modified: currentDate,
              });

              studentSchema
                .save()
                .then((data) => {
                  res.send("True");
                })
                .catch((err) => {
                  res.send("False");
                });
            } else {
              studentAttendance
                .findOne({ enrollment: enrollment })
                .then((docs) => {
                  var month = new Date().getMonth() + 1;
                  //console.log('Month from docs',month,' type:',typeof('month'));
                  var count = docs[month];
                  count = count + 1;
                  var newMonth = month.toString();
                  // console.log('new month',newMonth,' type of new month',typeof(newMonth));
                  studentAttendance
                    .findOne({ enrollment: enrollment })
                    .then((docs) => {
                      // if(docs.last_modified==currentDate)
                      // {
                      //     console.log('Already exist for this date');
                      //     res.send("False");
                      // }
                      // else
                      // {

                      studentAttendance
                        .updateOne(
                          { enrollment: enrollment },
                          {
                            $set: {
                              [newMonth]: count,
                              all: count,
                              last_modified: currentDate,
                            },
                          }
                        )
                        .then((docs) => {
                          //console.log('Updated Attendance',docs);
                          res.send("True");
                        });
                      // }
                    });
                });
            }
          });
      }
    }
  );
});
router.post("/reject_request", function (req, res) {
  var id = req.body.id;
  Request.updateOne({ _id: id }, { $set: { status: "Rejected" } }).then(
    (docs, err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Updated");
        res.send("True");
      }
    }
  );
});

router.post(
  "/attendance_request",
  nocache,
  ensureAuthenticated1,
  function (req, res) {
    var getdate = req.body.date;
    var lecture = req.body.lecture;

    console.log("Body:", req.body);

    var date = new Date(getdate);
    var currentDate =
      date.getFullYear().toString().toString() +
      "-" +
      ("0" + (date.getMonth() + 1)).slice(-2).toString() +
      "-" +
      ("0" + date.getDate()).slice(-2).toString();
    console.log("date:", currentDate);
    User.findById({ _id: req.user._id }).then((docs) => {
      console.log("User", docs);
      var request = new Request({
        StudentID: docs._id,
        name: docs.name,
        enrollment: docs.enrollment,
        rollno: req.user.rollno,
        semester: req.user.semester,
        date: currentDate,
        lecture: lecture,
      });
      request.save().then((docs) => {
        req.flash("success_msg", "Your Request has sent");
        res.redirect("/users/attendance_request");
      });
    });
  }
);

router.post("/add_attendance", function (req, res) {
  var enrollment = req.body.enroll;
  var name = req.body.name;
  console.log("working enrollment:" + enrollment);
  console.log("working name:" + name);
  var date = new Date();
  var currentDate =
    date.getFullYear().toString() +
    "-" +
    (date.getMonth() + 1).toString() +
    "-" +
    date.getDate().toString();
  studentAttendance
    .find({ enrollment: enrollment })
    .limit(1)
    .then((docs) => {
      if (docs.length == 0) {
        //console.log('in new attend save if');
        var month = new Date(currentDate).getMonth() + 1;
        var studentSchema = new studentAttendance({
          enrollment: enrollment,
          name: name,
          [month]: 1,
          all: 1,
          last_modified: currentDate,
        });

        studentSchema
          .save()
          .then((data) => {
            res.send("True");
          })
          .catch((err) => {
            console.log("from attendance:", err);
            res.send("False");
          });
      } else {
        studentAttendance.findOne({ enrollment: enrollment }).then((docs) => {
          var month = new Date().getMonth() + 1;
          //console.log('Month from docs',month,' type:',typeof('month'));
          var count = docs[month];
          count = count + 1;
          var newMonth = month.toString();
          // console.log('new month',newMonth,' type of new month',typeof(newMonth));
          studentAttendance.findOne({ enrollment: enrollment }).then((docs) => {
            // if(docs.last_modified==currentDate)
            // {
            //     console.log('Already exist for this date');
            //     res.send("False");
            // }
            // else
            // {

            studentAttendance
              .updateOne(
                { enrollment: enrollment },
                {
                  $set: {
                    [newMonth]: count,
                    all: count,
                    last_modified: currentDate,
                  },
                }
              )
              .then((docs) => {
                //console.log('Updated Attendance',docs);
                res.send("True");
              });
            // }
          });
        });
      }
    });
});
router.get(
  "/manage_attendance",
  nocache,
  ensureAuthenticated1,
  manage_attendance
);
function manage_attendance(req, res, next) {
  try {
    console.log("entered");
    var days = {
      1: 24,
      2: 24,
      3: 24,
      4: 24,
      5: 24,
      6: 24,
      7: 24,
      8: 24,
      9: 24,
      10: 24,
      11: 24,
      12: 24,
      365: 24,
    };
    studentAttendance.find().then((docs, err) => {
      if (err) {
        console.log(err);
      } else {
        //docs["outof"]="250";
        workingDays.find().then((doc, err) => {
          if (err) {
            console.log(err);
          } else {
            for (var i = 0; i < doc.length; i++) {
              console.log("in loop");
              days[doc[i].month] = doc[i].value;

              if (i == doc.length - 1) {
                //console.log(days);
                res.render("manageattendance", {
                  data: docs,
                  string: "All",
                  days: days,
                });
              }
            }
          }
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
}

router.get("/account", nocache, ensureAuthenticated1, function (req, res) {
  let info;
  User.findById({ _id: req.user._id }).then((docs) => {
    console.log(docs);
    res.render("account", { data: docs });
  });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    req.flash("error_msg", "Your are already logged in");
    res.redirect("/");
  } else {
    return next();
  }
}
function ensureAuthenticated1(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash("error_msg", "Your are not logged in");
    res.redirect("/users/login");
  }
}
function nocache(req, res, next) {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
  next();
}
router.post("/register", async function (req, res) {
  try {
    console.log("succeed", req.body);
    var enroll = req.body.enroll;
    var rollno = req.body.rollno;
    var name = req.body.name;
    var mobile = req.body.mobile;
    var email = req.body.email;
    var pemail = req.body.pemail;
    var password = req.body.password;
    var semester = req.body.semester;
    var department = req.body.department;
    var gender = req.body.gender;

    var newUser = new User({
      enrollment: enroll,
      rollno: rollno,
      name: name,
      mobile: mobile,
      email: email,
      pemail: pemail,
      password: password,
      semester: semester,
      department: department,
      gender: gender,
    });
    console.log(newUser);
    //console.log(newUser);

    await User.createUser(newUser);

    req.flash("success_msg", "Your are registered and can now login");
    res.redirect("/users/login");
  } catch (error) {
    req.flash("error_msg", "Please enter correct details");
    res.redirect("/users/register");
  }
});

router.post("/getdata", function (req, res) {
  var sem = req.body.sem;
  var rollno = req.body.rollno;

  console.log("sem:" + sem);
  console.log("rollno:" + rollno);
});

passport.use(
  new LocalStrategy(function (username, password, done) {
    console.log("called:", username);
    User.getUserByUsername(username, function (err, user) {
      // console.log('inside getuserbyname');
      if (err) throw err;

      console.log("user:", user);
      if (!user) {
        return done(null, false, { message: "Unknown User" });
      }
      User.comparePassword(password, user.password, function (err, isMatch) {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Invalid password" });
        }
      });
    });
  })
);
passport.serializeUser(function (user, done) {
  console.log("inside serial");
  id = user.id;
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  console.log("inside deserial");
  User.getUserById(id, function (err, user) {
    done(err, user);
  });
});
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/users/home",
    failureRedirect: "/users/login",
    failureFlash: true,
  }),
  function (req, res) {
    res.redirect("/");
  }
);

router.get("/get_student_data", function (req, res) {
  console.log("inside get student data");
  User.find().then((docs) => {
    if (docs) {
      res.send(docs);
    }
  });
});
router.get("/get_student_requests", function (req, res) {
  console.log("inside get student data");
  Request.find().then((docs) => {
    if (docs) {
      res.send(docs);
    }
  });
});

router.post("/attendance_log", function (req, res) {
  var enrollment = req.body.enroll;
  var time = req.body.time;
  var name = req.body.name;
  var rollno = req.body.rollno;
  var date = new Date();
  //var currentDate=date.getFullYear().toString()+'-'+(date.getMonth()+1).toString()+'-'+date.getDate().toString();
  var currentDate =
    date.getFullYear().toString().toString() +
    "-" +
    ("0" + (date.getMonth() + 1)).slice(-2).toString() +
    "-" +
    ("0" + date.getDate()).slice(-2).toString();

  var lecture;
  if (time < "8:51" && time > "8:44") {
    lecture = "1";
  } else if (time < "9:51" && time > "9:44") {
    lecture = "2";
  } else if (time < "11:40" && time > "11:00") {
    lecture = "3";
  } else if (time < "1:29" || time > "12:29") {
    lecture = "4";
  }

  var newLog = new Log({
    name: name,
    enrollment: enrollment,
    rollno: rollno,
    date: currentDate,
    lecture: lecture,
    status: "Done",
  });
  try {
    newLog.save();
    res.send("True");
  } catch (err) {
    console.log(err);
    res.send("False");
  }
});

router.post("/update_student", function (req, res) {
  var enrollment = req.body.enrollment;
  var rollno = req.body.rollno;
  var semester = req.body.semester;
  var department = req.body.department;
  var name = req.body.name;
  var mobile = req.body.mobile;
  var email = req.body.email;
  var gender = req.body.gender;

  User.updateOne(
    { enrollment: enrollment },
    {
      $set: {
        enrollment: enrollment,
        rollno: rollno,
        semester: semester,
        department: department,
        name: name,
        mobile: mobile,
        email: email,
        gender: gender,
      },
    }
  ).then((docs) => {
    // req.flash('success_msg','User Updated');
    // res.redirect('/users/manage_users');
    res.send("True");
  });
});

router.get("/working_days", nocache, function (req, res) {
  try {
    workingDays.find().then((docs) => {
      // res.render('workingdays',{
      //     data:docs
      // });
      console.log(docs);
      res.send(docs);
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/working_days", nocache, function (req, res) {
  var month = req.body.month;
  var days = req.body.days;
  //console.log(month,days);
  if (month == null || days == null) {
    res.send("Sorry..");
  } else {
    workingDays
      .find({ month: month })
      .limit(1)
      .then((docs) => {
        if (docs.length == 0) {
          var day = new workingDays({
            month: month,
            value: days,
          });
          day
            .save()
            .then((data) => {
              res.send("True");
            })
            .catch((err) => {
              res.send("False");
            });
        } else {
          workingDays
            .updateOne({ month: month }, { $set: { value: days } })
            .then((docs) => {
              if (docs) {
                res.send("True");
              } else {
                res.send("False");
              }
              // req.flash('success_msg','New Updated');
              //     res.redirect('/users/working_days');
            });
        }
      });
  }
});

router.get("/logout", nocache, ensureAuthenticated1, function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err); // Handle error if logout fails
    }
    req.flash("success_msg", "You are logged out");
    res.redirect("/users/login");
  });
});
router.get("/get_enrollments", function (req, res) {
  var studentnames = [];
  var usernames = [];

  User.find().then((docs) => {
    for (var i = 0; i < docs.length; i++) {
      var obj_data = {
        enrollment: "",
      };
      obj_data.enrollment = docs[i].enrollment;

      studentnames.push(obj_data);
      if (i == docs.length - 1) {
        console.log(studentnames);
        res.send(studentnames);
      }
    }
  });
});

router.post("/send_mail", function (req, res) {
  console.log("inside send mail");
  var rolls = req.body.rolls;
  var pemails = [];
  console.log("Not done:", rolls);
  res.send("True");
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "silentassassin5635@gmail.com",
      pass: "Appledore1015512",
    },
  });
  for (i = 0; i < rolls.length; i++) {
    User.find({ rollno: rolls[i] }).then((docs) => {
      if (docs.length != 0) {
        // console.log(docs);
        console.log(docs[0].pemail);
        pemails.push(docs[0].pemail);
        var mailOptions = {
          from: "silentassassin5635@gmail.com",
          to: docs[0].pemail,
          subject: "Attendance Report",
          text: "Your student was absent today",
        };
        transporter.sendMail(mailOptions, function (err, info) {
          if (err) console.log(err);
          else console.log("Email sent:" + info.response);
        });
      }
    });
    if (i == rolls.length - 1) {
      console.log("pemails:", pemails);
    }
  }
});

router.post("/get_student_enrollment_wise", function (req, res) {
  var enrollment = req.body.enrollment;
  User.find({ enrollment: enrollment }).then((docs) => {
    if (docs) {
      res.send(docs);
    }
  });
});

module.exports = router;
