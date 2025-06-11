const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");


exports.login = async (req ,res) => {
    try{
        let user = await userModel.findOne({ email : req.body.email });
       if(!user) {
        req.flash("error", "You can't sign it");
     return res.redirect("/authRoute");
       }
       bcrypt.compare(req.body.password, user.password, (err,result) => {
        if(result){
            let token = jwt.sign({ email : user.email }, "helloworld" ,{
                expiresIn : "1h"
            });
            res.cookie("token",token);
            req.flash("success","You can Go To profile Page:");
            res.redirect("/profileRoute");
        }else{
            req.flash("error","something Went Wrong");
            res.redirect("/loginRoute");
        }
       })
    }catch(err){
     res.send("something went wrong");
    }
}