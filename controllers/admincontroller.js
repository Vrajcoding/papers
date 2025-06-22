const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, TOKEN_EXPIRY, SALT_ROUND } = require("../utils/constant"); 
const Admin = require("../models/admin-model");

exports.register = async (req, res) => {
  try{
  const { name, email, password ,confirmpassword } = req.body;

  if (password !== confirmpassword) {
      req.flash("error", "Passwords do not match");
      return res.redirect("/admin/create");
    }

  const adminExist = await Admin.findOne({ email });
  if (adminExist) {
    req.flash("error", "Admin accecedd denied");
    return res.redirect("/admin/create");
  }
   const hashedpassword = await bcrypt.hash(password ,SALT_ROUND);
   const admin = await Admin.create({
      name,
      email,
      password: hashedpassword,
      isAdmin : true
    });

    let token = jwt.sign({ id: admin._id, email: admin.email ,isAdmin : admin.isAdmin },JWT_SECRET, {
      expiresIn: TOKEN_EXPIRY,
    });
    res.cookie("token", token , { httpOnly : true });
    req.flash("success", "User created Successfully");
    res.redirect("/admin/upload");
  } catch (err) {
    console.error('Admin registration error:', err);
    req.flash('error', 'Admin registration failed');
    res.redirect('/admin/create');
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if(!admin) {
      req.flash("error","Invalid credentials");
      return res.redirect("/admin/login");
    }

    const isMatch = await bcrypt.compare(password , admin.password);
    if(!isMatch) {
      req.flash("error", "Invalid credentials");
      return res.redirect("/admin/login");
    }

    const token = jwt.sign(
      { id : admin._id , email : admin.email , isAdmin : admin.isAdmin},
      JWT_SECRET,{ expiresIn : TOKEN_EXPIRY });

      res.cookie("token" ,token, { 
        httpOnly : true,
        secure : process.env.NODE_ENV === "production"
      });
      req.flash("success", "Admin login Sucessedfully");
      res.redirect("/admin/upload");
  } catch(err) { 
    console.error('Admin login error:', err);
    req.flash('error', 'Admin login failed');
    res.redirect('/admin/login');
  }
}
