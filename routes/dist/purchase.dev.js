"use strict";

var express = require("express");

var router = express.Router(); // Bring Course and Purchase Table !

var Course = require("../tables/Courses");

var Purchase = require("../tables/Purchase"); // @type    GET
//@route    /purchase/:id
// @desc    Purchase Course
// @access  Private


router.get("/:id", function (request, response) {
  var id = request.params.id; // Create Timestamp !

  var timeStamp = new Date().toLocaleString();
  Course.findOne({
    _id: id
  }).then(function (course) {
    console.log("Course : ", course); // Structure !
    // const purchaseObject = {
    //     courseID : [],
    //     courseName : [],
    //     user : request.session.username,
    //     email : request.session.email,
    //     timeStamp : timeStamp
    // }

    Purchase.findOne({
      email: request.session.email
    }).then(function (purchase) {
      console.log("Purchase : ", purchase); // If purchase object has been created previously ! That means user has purchase history on website !

      if (purchase) {
        console.log("Purchase object exists !");
        console.log("Purchased Courses : ", purchase.courseName); // Logic

        var getIndex = purchase.courseName.findIndex(function (courses) {
          return courses === course.courseName;
        });
        console.log(getIndex);

        if (getIndex >= 0) {
          // If user has purchased it already !
          response.json({
            result: "fail",
            type: "alreadypurchased"
          });
        } else {
          // Update the purchased courses !
          Purchase.updateOne({
            email: request.session.email
          }, {
            $push: {
              courseID: id,
              courseName: course.courseName
            }
          }).then(function () {
            response.json({
              result: "success",
              type: "coursepurchased"
            });
          })["catch"](function (error) {
            console.log("Error : ".concat(error));
            response.status(501).json({
              result: "fail",
              type: "DBerror"
            });
          });
        }
      } else {
        console.log("First Time !"); // Create new purchase Object !

        var purchaseObject = {
          courseID: [],
          courseName: [],
          user: request.session.username,
          email: request.session.email,
          timeStamp: timeStamp
        }; // Push id and course names !

        purchaseObject.courseID.push(id);
        purchaseObject.courseName.push(course.courseName); // Store this object into database !

        new Purchase(purchaseObject).save().then(function (purchasedCourse) {
          console.log("Course Purchased");
          response.json({
            result: 'success',
            type: 'coursepurchased'
          });
        })["catch"](function (error) {
          console.log("Error : ".concat(error));
          response.status(501).json({
            result: "fail",
            type: "DBerror"
          });
        });
      }
    })["catch"](function (error) {
      console.log("Error : ".concat(error));
      response.status(501).json({
        result: "fail",
        type: "DBerror"
      });
    });
  })["catch"](function (error) {
    console.log("Error : ".concat(error));
    response.status(501).json({
      result: "fail",
      type: "DBerror"
    });
  });
});
module.exports = router;