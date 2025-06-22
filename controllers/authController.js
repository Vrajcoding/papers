const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, TOKEN_EXPIRY, SALT_ROUND } = require("../utils/constant");
const User = require("../models/user-model");
const Admin = require("../models/admin-model");

exports.register = async (req, res) => {
  try{
  const { name, email, password } = req.body;

  const userExist = await User.findOne({ email });
  if (userExist) {
    req.flash("error", "user Already Exist");
    return res.redirect("/auth/register");
  }
   
  const hashedpassword = await bcrypt.hash(password, SALT_ROUND);
  const user = await User.create({
    name,
    email,
    password : hashedpassword,
    isAdmin : false
  });

  const token = jwt.sign({
    id : user._id, email : user.email, isAdmin : user.isAdmin
  },JWT_SECRET , { expiresIn : "1h" });


  res.cookie("token", token, {httpOnly : true});
  req.flash("success", "Registred succesfully");
  res.redirect('/profile');
} catch(err) {
  console.error("Registration error :",err);
  req.flash("error", "Registration Failed");
  res.redirect("/auth/register");
 }
};

exports.loginUser = async (req,res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if(!user) {
     req.flash("error", "Invalid credentials");
     return res.redirect("/auth/login");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
      req.flash('error', 'Invalid credentials');
      return res.redirect('/auth/login');
    }

    const token = jwt.sign( {
      id: user._id , email : user.email ,isAdmin : user.isAdmin
    }, JWT_SECRET , { expiresIn : "1h"});

    res.cookie("token" ,token, {
      httpOnly : true,
      secure : process.env.NODE_ENV === "production"
    });
    req.flash("success", "Login Sucessfully");
    res.redirect("/profile");
  } catch(err) {
    console.error('Login error:', err);
    req.flash('error', 'Login failed');
    res.redirect('/auth/login');
  }
};
