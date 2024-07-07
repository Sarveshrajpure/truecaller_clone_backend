const Joi = require("joi");

const addSpamRecordSchema = Joi.object({
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

module.exports = { addSpamRecordSchema };
