
const mongoose = require('mongoose');

const MidexamSchema = mongoose.Schema({
 semester : {
    type : Number,
    required : true
 },
 year : {
    type : Number,
    required : true
 },
 subjectcode : {
    type : Number,
    required : true
 },
 department : {
    type : String,
    required : true
 },
 subject : {
   type: String,
   required: true
 },
 current : {
  type : String,
  enum : ["winter","summer"],
  required : true
 },
 types : {
   type : String,
   enum : ["mid","end"],
   required : true
 },
 fileUrl :  {
    type : String,
    required : true
 },
 uploadedBY : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "Admin",
    required : true
 },
 createdAt : {
    type : Date,
    default : Date.now
 }
});

module.exports = mongoose.model("Midexam",MidexamSchema);