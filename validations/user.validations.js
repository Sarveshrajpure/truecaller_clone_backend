const Joi = require("joi");
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{6,}$/;
const passwordErrorMsg = `Should contain atleast a capital letter, atleast a small letter, atleast a number, atleast a special character, And minimum length 6`;

const userRegisterSchema = Joi.object({
  name: Joi.string().min(3).max(300).required("Name required!"),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
  password: Joi.string()
    .regex(passwordRegex)
    .message(`Invalid password, please ensure :- ${passwordErrorMsg}`)
    .required(),
  phoneNumber: Joi.string()
    .min(10)
    .max(15)
    .regex(/^[0-9]*$/)
    .messages({
      "string.min": "Phone number must be minimum 10 digits",
      "string.max": "Phone number must be maximum 15 digits",
      "string.pattern.base": `Phone number must have 10 digits.`,
    })
    .required(),
});

module.exports = { userRegisterSchema };
