const express = require("express");
const router = express.Router();


// Bring Courses Table !
const Course = require("../tables/Courses");
const Tickets = require("../tables/Tickets");


// @type    POST
//@route    /course/add
// @desc    Add course !
// @access  Private

router.get("/", function (request, response) {
    let { username, role } = request.session;


    Tickets.find()
        .then((tickets) => {

            let mentorTickets = [];

            if (role === "Mentor") {
                tickets.forEach((ticket) => {
                    if (ticket.mentorName === username) {
                        mentorTickets.push(ticket);
                    }
                })

                response.render("history", {
                    tickets: mentorTickets,
                    role : role
                });


            } else {
                response.render("history", {
                    tickets: tickets,
                    role : role
                });
            }

        })
        .catch(err => console.log("Error Occured: ", err));
});



module.exports = router;