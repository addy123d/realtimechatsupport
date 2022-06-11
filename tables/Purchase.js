const mongoose = require("mongoose");
const schema = mongoose.Schema;

const purchaseSchema = new schema({
    user : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true
    },
    courseName : {
        type: [String],
        required: true
    },
    courseID : {
        type: [String],
        required: true
    },
    timeStamp : {
        type: String,
        required : true
    }
});


module.exports = Purchase = mongoose.model("purchase",purchaseSchema);