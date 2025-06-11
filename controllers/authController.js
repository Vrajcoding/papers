const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");

exports.register = async (req, res) => {
  const { name, email, password, confirmpassword } = req.body;

  const userExist = await userModel.findOne({ email });
  if (userExist) {
    req.flash("error", "user Already Exist");
    return res.redirect("/authroute");
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    let user = await userModel.create({
      name,
      email,
      password: hash,
    });

    let token = jwt.sign({ id: user._id, email: user.email }, "helloworld", {
      expiresIn: "1h",
    });
    res.cookie("token", token);
    req.flash("success", "Registered successfully!");
    res.redirect("/loginroute");
  } catch (err) {
    req.flash("error", "Registration failed. Please try again.");
    res.redirect("/authroute");
  }
};
