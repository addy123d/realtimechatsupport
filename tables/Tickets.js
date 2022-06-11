const mongoose = require("mongoose");
const schema = mongoose.Schema;

const ticketSchema = new schema({
    name : {
        type: String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    courseName : {
        type: String,
        required: true
    },
    mentorName : {
        type : String,
        required : true
    },
    query : {
        type : String,
        required : true
    },
    solution : {
        type : String,
        required : true
    },
    status : {
        type : String,
        required : true
    },
    timeStamp : {
        type: String,
        required : true
    }
});


module.exports = Tickets = mongoose.model("tickets",ticketSchema);