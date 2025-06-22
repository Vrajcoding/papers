const express = require('express');
const route = express.Router();
const { authenticate } = require("../middleware/auth");
const User = require("../models/user-model");

route.get("/", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/auth/login');
    }
    res.render("profilePage", { user }); 
  } catch(err) {
    console.error('Profile error:', err);
    req.flash('error', 'Failed to load profile');
    res.redirect('/auth/login');
  }
});

module.exports = route;