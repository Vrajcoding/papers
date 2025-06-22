const Joi = require('joi');

const userSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ['com', 'net', 'org', 'in', 'edu'] }
  }).required(),
  password: Joi.string().min(6).required(),
  confirmpassword: Joi.string().valid(Joi.ref('password')).required()
    .messages({ 'any.only': 'Passwords do not match' })
});

exports.validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);

  if (error) {
    req.flash('error', error.details[0].message);
    return res.redirect(req.originalUrl);
  }

  next();
};