const mongoose = require("mongoose");
const schema = mongoose.Schema;

const courseSchema = new schema({
    email : {
        type : String,
        required : true
    },
    courseName : {
        type: String,
        required: true
    },
    mentorName :{ 
        type : String,
        required : true
    },
    timeStamp : {
        type: String,
        required : true
    }
});


module.exports = Course = mongoose.model("course",courseSchema);