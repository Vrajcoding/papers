const express = require("express");
const route = express.Router();
const admincontroller = require("../controllers/admincontroller");
const { authenticate, requireAdmin }  = require("../middleware/auth");

route.get("/create", (req, res) => {
    res.render("admin/create");
})

route.get("/login", (req,res) => {
    res.render('admin/login');
})

route.get("/upload", authenticate, requireAdmin, (req, res) => {
    res.render("admin/upload")
})

route.post("/create", admincontroller.register);
route.post("/login", admincontroller.loginAdmin);

module.exports = route;