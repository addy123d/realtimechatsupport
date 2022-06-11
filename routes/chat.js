const express = require("express");
const router = express.Router();

router.get("/", (request, response) => {
    console.log(request.session);

    // Retrieve Email of the user from the session !
    let { email } = request.session;



    // Response
            response.render("chat", {
                userName: request.session.username,
                role : request.session.role
            });


});


module.exports = router;