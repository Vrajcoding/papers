const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/papercollection");

const MidexamSchema = mongoose.Schema({
 semester : Number,
 year : Number,
 subjectcode : Number,
 fileUrl :  String,
});

module.exports = mongoose.model("Midexam",MidexamSchema);