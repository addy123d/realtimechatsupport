const mongoose = require("mongoose");
const schema = mongoose.Schema;

const userSchema = new schema({
    username : {
        type: String,
        required: true
    },
    role : {
        type: String,
        required: true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    timeStamp : {
        type: String,
        required : true
    }
});


module.exports = User = mongoose.model("user",userSchema);