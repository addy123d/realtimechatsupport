const express = require("express");
const router = express.Router();


const Courses = require("../tables/Courses");
const Tickets = require("../tables/Tickets");

router.get("/", (request, response) => {
    let { topic,id } = request.query;
    let { username, email, role } = request.session;
    let mentorNames = [];
    let courseNames = [];


    console.log("Topic Name: ");
    console.log(topic);

    Courses.find()
        .then((courses) => {
            if (!courses) {
                response.send("No courses exists !");
            } else {
                // console.log("Courses: ");
                // console.log(courses[0].courseName);

                for (let i = 0; i < courses.length; i++) {
                    mentorNames.push(courses[i].mentorName);
                    courseNames.push(courses[i].courseName);
                }

                if (role != "Mentor") {
                    console.log("Mentor Names: ");
                    console.log(mentorNames);

                    response.render("ticketform", {
                        name: username,
                        email: email,
                        topic: topic,
                        mentorNames: mentorNames,
                        courseNames: courseNames
                    });
                } else {
                    Tickets.findById({_id : id})
                        .then((ticket)=>{
                            response.render("ticketform", {
                                name: ticket.name,
                                email: ticket.email,
                                topic: ticket.courseName,
                                mentorNames: mentorNames,
                                courseNames: courseNames
                            });
                        })
                        .catch(err=>console.log("Error: ",err));
                }

            }
        })
        .catch((error) => console.log("Error Occured: ", error));
});

router.post("/ticketGenerate", (request, response) => {
    console.log("Route Hit");
    let { name, email, topic, query, mentor } = request.body;
    let status = "pending";

    let ticketObject = {
        name: name,
        email: email,
        courseName: topic,
        mentorName: mentor,
        solution : "",
        query: query,
        status: status,
        timeStamp: new Date().toLocaleString()
    }

    new Tickets(ticketObject).save()
        .then(() => {
            console.log("Ticket Generated Successfully !");

            response.json({
                status: "Ticket Generated",
                responseCode: 200
            });
        })
        .catch((error) => {
            console.log("Error Occured: ", error);
        });

})

module.exports = router;
