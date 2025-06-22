const mongoose = require('mongoose');


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
   isAdmin : {
    type : Boolean,
    default : false
   },
   createdAt : {
    type : Date,
    default : Date.now
   }
});

module.exports = mongoose.model("user",userSchema);

