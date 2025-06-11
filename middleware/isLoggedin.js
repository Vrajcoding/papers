const jwt = require("jsonwebtoken");
module.exports = (req, res, next) =>{
        let token = req.cookies.token;
        if(!token){
        req.flash("error","You can be First Login");
        res.redirect("/loginroute");
        }
    try{
      const Verified = jwt.verify(token,"helloworld");
      req.user = Verified;
      next();
    }catch(err){
     req.flash("error","Invalid or expired token")
     res.redirect("/loginroute");
    }
}