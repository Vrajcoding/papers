const express = require('express');
const authLogin = require('../controllers/authLogin');
const route = express.Router();


route.get("/" , (req, res) => {
    res.render("loginPage");
})

route.post("/login",authLogin.login);

module.exports = route;