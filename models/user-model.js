const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/papercollection");

const userSchema = mongoose.Schema({
    name : {
        type : String,
        minlength : 3,
        trim : true
    },

    email: {
        type : String,
        unique : true
    },
    password : String,
});

module.exports = mongoose.model("user",userSchema);

