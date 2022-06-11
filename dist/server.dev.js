"use strict";

// Initialisations !
// ADD Dependency - Express, Mongoose, Express-Session
var express = require("express");

var mongoose = require("mongoose");

var session = require("express-session");

var ejs = require("ejs");

var _require = require("./middleware/middleware"),
    redirectLogin = _require.redirectLogin,
    redirectHome = _require.redirectHome; // Port and Host


var port = 5500;
var host = '127.0.0.1'; // Calling express app !

var app = express(); // Session Configuration !

var sess = {
  name: "User",
  resave: false,
  saveUninitialized: true,
  secret: "mySecret",
  cookie: {}
};

if (app.get('env') === "production") {
  sess.cookie.secure = false;
  sess.cookie.maxAge = 60 * 60;
  sess.cookie.sameSite = true;
}

;
app.use(session(sess)); // Data transfer configurations !

app.use(express.json()); // Data is parsed into format :- JSON (Javascript Object Notation)

app.use(express.urlencoded({
  extended: false
})); // Views configuration !

app.set("view engine", "ejs"); // Bring Route files from routes folder !

var auth = require("./routes/auth");

var course = require("./routes/course");

var purchase = require("./routes/purchase"); // Bring url !


var url = require("./setup/config").url; // Database Connection !


var options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};
mongoose.connect(url, options).then(function () {
  console.log("Database Connected Successfully !");
})["catch"](function (error) {
  console.log("Something went wrong ! - ".concat(error));
}); // Bring Courses Table !

var Course = require("./tables/Courses"); // Routes


app.get("/", redirectLogin, function (request, response) {
  var email = request.session.email;
  console.log(email);
  var adminStatus;
  adminStatus = email.includes("@admin.com") ? 1 : 0;
  Course.find().then(function (courses) {
    response.render("courses", {
      courses: courses,
      adminStatus: adminStatus
    });
  })["catch"](function (error) {
    console.log("Error : ".concat(error));
  });
}); // Authentication Route !

app.use("/auth", redirectHome, auth); // Courses ADD/DELETE Route !

app.use("/course", redirectLogin, course); // Course Purchase Route !

app.use("/purchase", redirectLogin, purchase); //@type - GET
//@access - Private
//@route - /logout

app.get("/logout", redirectLogin, function (request, response) {
  request.session.destroy(function (error) {
    if (error) {
      response.redirect("/");
    } else {
      response.redirect("/auth/register");
    }
  });
}); // Listen to port 5500 !

app.listen(port, host, function () {
  console.log("Server is running at port ".concat(port));
});