"use strict";

var express = require("express");

var router = express.Router(); // Bring Courses Table !

var Course = require("../tables/Courses"); // @type    POST
//@route    /course/add
// @desc    Add course !
// @access  Private


router.post("/add", function (request, response) {
  var _request$body = request.body,
      courseName = _request$body.courseName,
      imgUrl = _request$body.imgUrl; // Database Query !

  Course.findOne({
    courseName: courseName
  }).then(function (course) {
    // Check if course exists with same name !
    if (course) {
      response.json({
        result: "fail",
        type: "DuplicateName"
      });
    } else {
      var timeStamp = new Date().toLocaleString(); // Create Course Object !

      var _course = {
        courseName: courseName,
        imgUrl: imgUrl,
        timeStamp: timeStamp
      };
      new Course(_course).save().then(function () {
        console.log("Course Updated !"); // Send response !

        response.json({
          result: "success"
        });
      })["catch"](function (error) {
        console.log("Error : ".concat(error));
        response.status(501).json({
          result: "fail",
          type: "DBerror"
        });
      });
    }

    ;
  })["catch"](function (error) {
    console.log("Error : ".concat(error));
  });
}); // @type    POST
//@route    /course/delete
// @desc    Delete course !
// @access  Private

router.post("/delete", function (request, response) {
  var courseName = request.body.courseName;
  Course.findOne({
    courseName: courseName
  }).then(function (course) {
    if (!course) {
      // If course doesn't exists -> give 404 response to user !
      response.json({
        result: "fail",
        type: "Doesn't Exists !"
      });
    } else {
      Course.findByIdAndDelete({
        _id: course._id
      }).then(function () {
        console.log("Course Deleted !"); // Send response !

        response.json({
          result: "success"
        });
      })["catch"](function (error) {
        console.log(" Error : ".concat(error, " "));
        response.status(501).json({
          result: "fail",
          type: "DBerror"
        });
      });
    }
  })["catch"](function (error) {
    console.log("Error : ".concat(error));
  });
});
module.exports = router;