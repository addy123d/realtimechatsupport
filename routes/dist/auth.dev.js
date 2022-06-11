"use strict";

var express = require("express");

var router = express.Router(); // Bring Register Table !

var User = require("../tables/Register"); // @type    GET
//@route    /auth/register
// @desc    Registers User
// @access  PUBLIC


router.get("/register", function (request, response) {
  response.render("register");
}); // @type     POST
//@route    /auth/registerDetails
// @desc    Save Registration Details into the database !
// @access  PUBLIC

router.post("/registerDetails", function (request, response) {
  // Deconstruct all the data from an object !
  var _request$body = request.body,
      username = _request$body.username,
      email = _request$body.email,
      password = _request$body.password; // @TODO -  Backend password validation !
  // Create Timestamp !

  var timeStamp = new Date().toLocaleString();
  User.findOne({
    email: email
  }).then(function (user) {
    // Check if user exists or not !
    if (user) {
      // Send response that user exists already !
      response.json({
        emailerror: "User exists already !"
      });
    } else {
      // Save user data into database !
      // Create User Object to be stored in database !
      var _user = {
        username: username,
        email: email,
        password: password,
        timeStamp: timeStamp
      }; // Store User Object in database !

      new User(_user).save().then(function (user) {
        console.log("Data Saved Successfully !"); // Store data into session !

        request.session.email = user.email;
        request.session.username = user.username;
        request.session.ID = user._id;
        console.log(request.session); // Response

        response.json({
          success: "Registered Successfully !"
        });
      })["catch"](function (error) {
        console.log("Database Error : ".concat(error, " "));
      });
    }
  })["catch"](function (error) {
    console.log("Error : ".concat(error));
  });
}); // @type    GET
//@route    /auth/login
// @desc    Registers User
// @access  PUBLIC

router.get("/login", function (request, response) {
  response.render("login");
}); // @type     POST
//@route    /auth/loginDetails
// @desc    Sign In  !
// @access  PUBLIC

router.post("/loginDetails", function (request, response) {
  // Deconstruct Body Object !
  var _request$body2 = request.body,
      email = _request$body2.email,
      password = _request$body2.password; // Handle admin credentials !

  if (email.includes("@admin.com") && password === "admin12345") {
    request.session.email = email;
    response.redirect("/");
  } else {
    // Handle users credentials !
    // Bring User Table !
    User.findOne({
      email: email
    }).then(function (user) {
      // Check whether user exists or not !
      if (user) {
        // User exists !
        // Now compare password from the database and password from the form !
        if (password === user.password) {
          //Here user will be an object containing all details as its properties !
          // Store data into session !
          request.session.email = user.email;
          request.session.username = user.username;
          request.session.ID = user._id; // Response !

          response.json({
            success: "Successfully Logged In !"
          });
        } else {
          response.json({
            passworderror: "Password not matched !"
          });
        }

        ;
      } else {
        // User Doesn't exists !
        response.json({
          emailerror: "User is not registered"
        });
      }

      ;
    })["catch"](function (error) {
      console.log("Error : ".concat(error));
    });
  }
});
module.exports = router;