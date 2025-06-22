const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
 name : {
  type : String,
  required : true
 },
 email : {
 type : String,
 required : true,
 unique : true
 },
 password : {
  type : String,
  required : true
 },
 Uploadpdf : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : "Midexam"
 }],
 isAdmin : {
  type : Boolean,
  default : true
 },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Admin",adminSchema);

