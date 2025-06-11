const express = require('express');
const route = express.Router();
const authcontroller = require('../controllers/authController');
const validateuser = require('../middleware/validateUser');


route.get("/" , (req, res) => {
    res.render("registrationPage");
})

route.post("/registration",validateuser, authcontroller.register);

module.exports = route;