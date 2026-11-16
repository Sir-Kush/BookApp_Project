// Joi Schema
const Joi = require('joi');
const joiPwd = require('joi-password-complexity');


// User Schema
const userSchema = Joi.object({
   email: Joi.string().email().required(),
   password: Joi.string().min(10).max(30).required(),
   // confirmPassword: JoiPad.string().required(),
});


// Password complexity
const complexityOptions = {
   min: 10,
   max: 30,
   lowerCase: 1,
   upperCase: 1,
   numeric: 1,
   symbol: 1,
   requirementCount:2,
}

module.exports.userVal = userSchema;
module.exports.pwdVal = joiPwd(complexityOptions);