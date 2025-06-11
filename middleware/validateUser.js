const Joi = require("joi");

const schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "org", "in", "edu"] },
    })
    .required(),
  password: Joi.string().min(6).required(),
  confirmpassword: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({ "any.only": "Passwords do not match" }),
});

module.exports = (req, res, next) => {
  const { error } = schema.validate(req.body);

  if (error) {
    req.flash("error", error.details[0].message);
    return res.redirect("/authroute");
  }

  next();
};
