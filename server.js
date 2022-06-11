// Initialisations !
// ADD Dependency - Express, Mongoose, Express-Session
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const webSocket = require("ws");
const ejs = require("ejs");
const {
    redirectLogin,
    redirectHome
} = require("./middleware/middleware");

// Port and Host
const port = process.env.PORT || 5000;
const host = '0.0.0.0';

// Calling express app !
const app = express();

// Session Configuration !
const sess = {
    name: "User",
    resave: false,
    saveUninitialized: true,
    secret: "mySecret",
    cookie: {}
}


if (app.get('env') === "production") {
    sess.cookie.secure = false;
    sess.cookie.maxAge = 60 * 60;
    sess.cookie.sameSite = true;
};

app.use(session(sess));


// Data transfer configurations !
app.use(express.json());   // Data is parsed into format :- JSON (Javascript Object Notation)
app.use(express.urlencoded({ extended: false }));

// Views configuration !
app.set("view engine", "ejs");


// Bring Route files from routes folder !
const auth = require("./routes/auth");
const course = require("./routes/course");
const purchase = require("./routes/purchase");
const chat = require("./routes/chat");
const ticket = require("./routes/ticket");
const history = require("./routes/history");

// Bring url !
const url = require("./setup/config").url;

// Database Connection !
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

mongoose.connect(url, options)
    .then(function () {
        console.log("Database Connected Successfully !");
    })
    .catch(function (error) {
        console.log(`Something went wrong ! - ${error}`);
    });

// Bring Courses Table !
const Course = require("./tables/Courses");
const Tickets = require("./tables/Tickets");

app.use(express.static(__dirname + "/public"));

// Routes
app.get("/", redirectLogin, function (request, response) {

    const { email } = request.session;
    let { username } = request.session;
    console.log(email);

    let adminStatus;

    adminStatus = request.session.role === "Mentor" ? 1 : 0;

    Course.find()
        .then(function (courses) {
            response.render("courses", { courses, adminStatus, username });
        })
        .catch(function (error) {
            console.log(`Error : ${error}`);
        });

});

// Authentication Route !
app.use("/auth", redirectHome, auth);

// Courses ADD/DELETE Route !
app.use("/course", redirectLogin, course);

// Course Purchase Route !
app.use("/purchase", redirectLogin, purchase);

// Chat route
app.use("/chat", redirectLogin, chat);

// Unresolved
app.use("/unresolved", redirectLogin, ticket);

app.use("/queryhistory", redirectLogin, history);

app.get("/edit", redirectLogin, (request, response) => {
    let { id } = request.query;
    let mentorNames = [];
    console.log("ID: ",id);

    Course.find()
        .then((courses)=>{
            if (!courses) {
                response.send("No courses exists !");
            } else {
                // console.log("Courses: ");
                // console.log(courses[0].courseName);

                for (let i = 0; i < courses.length; i++) {
                    mentorNames.push(courses[i].mentorName);
                }

            }

            Tickets.findById({ _id: id })
            .then((ticket) => {
                console.log(ticket);
                response.render("edit", {
                    id : id,
                    name: ticket.name,
                    email: ticket.email,
                    query: ticket.query,
                    courseName : ticket.courseName,
                    mentorNames : mentorNames
                })
            })
            .catch(err => console.log("Error: ", err));
        })
        .catch(err=>console.log("Error: ",err));


})

app.post("/updateTicket", (request, response) => {
    let { id, status, solution, mentor } = request.body;

    Tickets.updateOne({ _id: id}, {
        $set: { status: status, solution: solution, mentorName: mentor }
    }, {
        $new: true
    })
        .then(() => {
            response.json({
                responseCode: 200
            })
        })
        .catch(err => console.log("Error: ", err));

})
//@type - GET
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
});


// Listen to port 5500 !
let server = app.listen(port, host, function () {
    console.log(`Server is running at port ${port}`);
});

let wss = new webSocket.Server({ server: server });

wss.on("connection", (ws) => {
    ws.send(JSON.stringify({
        message: "Connection Opened..."
    }));

    // Receive Commands from client !
    ws.on("message", (commands) => {
        console.log("Data: ");
        console.log(commands);

        // Goal : We have to receive commands here and send these commands to device and clients connected to these server !

        let parsed_commands = JSON.parse(commands);

        console.log("Commands: ");
        console.log(parsed_commands);
        // console.log(parsed_commands.command);

        // Broadcast that command over all clients !
        wss.clients.forEach(function each(client) {
            client.send(JSON.stringify({
                name: parsed_commands.name,
                query: parsed_commands.query
            }));
        });
    })

    // Prompts when client connects to server !
    console.log("Client Connected !");
});

