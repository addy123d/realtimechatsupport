const express = require("express");
const router = express.Router();


// Bring Courses Table !
const Course = require("../tables/Courses");


// @type    POST
//@route    /course/add
// @desc    Add course !
// @access  Private

router.post("/add",function(request,response){
    // let name = request.session.username;
    let email = request.session.email;
    const {courseName,imgUrl,mentorName} = request.body;

    console.log("Session: ",request.session);

    // Database Query !
    Course.findOne({courseName : courseName})
        .then(function(course){
            // Check if course exists with same name !
            if(course){

                response.json({
                    result : "fail",
                    type: "DuplicateName"
                });

            }else{

                const timeStamp = new Date().toLocaleString();

                // Create Course Object !
                let courseObject = {
                    email,courseName,imgUrl,mentorName,timeStamp
                };

                console.log("Course Object: ");
                console.log(courseObject);


                new Course(courseObject).save()
                    .then(function(){
                        console.log("Course Updated !");

                        // Send response !
                        response.json({
                            result: "success"
                        });
                    })
                    .catch(function(error){
                        console.log(`Error : ${error}`);

                        response.status(501).json({
                            result : "fail",
                            type: "DBerror"
                        });
                    });
            };
        })
        .catch(function(error){
            console.log(`Error : ${error}`);
        });


});


// @type    POST
//@route    /course/delete
// @desc    Delete course !
// @access  Private

router.post("/delete",function(request,response){
    const {courseName} = request.body;

    Course.findOne({courseName : courseName})
        .then(function(course){

            if(!course){

                // If course doesn't exists -> give 404 response to user !
                response.json({
                    result : "fail",
                    type: "Doesn't Exists !"
                });

            }else{

                Course.findByIdAndDelete({_id : course._id})
                    .then(function(){
                        console.log("Course Deleted !");

                        // Send response !
                        response.json({
                            result: "success"
                        });
                    })
                    .catch(function(error){
                        console.log(` Error : ${error} `);

                        response.status(501).json({
                            result : "fail",
                            type: "DBerror"
                        });
                    });
            }

        })
        .catch(function(error){
            console.log(`Error : ${error}`);
        });

});

module.exports = router;