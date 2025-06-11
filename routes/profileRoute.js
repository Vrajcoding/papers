const express = require('express');
const route = express.Router();
const isloggedin = require('../middleware/isLoggedin');
const userModel = require("../models/user-model");

route.get("/" ,isloggedin,async (req, res) => {
  const user = await userModel.findOne({ email: req.user.email });
  res.render("profilePage" ,{ user });
})

module.exports = route;

