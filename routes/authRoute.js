const express = require('express');
const route = express.Router();
const authController = require("../controllers/authController");
const validate = require("../middleware/validateUser");


route.get("/login", (req, res) => {
    res.render("auth/login");
})

route.get("/register", (req, res) => {
    res.render("auth/register");
})

route.post("/register", validate.validateUser, authController.register);
route.post("/login", authController.loginUser);

module.exports = route;
