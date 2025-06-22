const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/constant");

exports.authenticate = (req, res, next) => {
    const token = req.cookies.token;

    if(!token) {
      req.flash("error", "Please login First");
      return res.redirect("/auth/login");
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch(err) {
        req.flash("error", "Invalid or Expried token");
        res.clearCookie("token");
        res.redirect("/auth/login");
    }
};

exports.requireAdmin = (req, res, next) => {
    if(!req.user || !req.user.isAdmin) {
        req.flash("error", "Admin access denied");
        return res.redirect('/auth/login');
    }
    next();
}