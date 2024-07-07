const Joi = require("joi");

const contactSchema = Joi.object({
  name: Joi.string().min(3).max(300).required("Name required!"),
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

const importUserContactsSchema = Joi.object({ contacts: Joi.array().items(contactSchema) });

const searchByNameSchema = Joi.object({
  name: Joi.string().max(300).required("Name required!"),
});

const searchByPhoneNumberSchema = Joi.object({
  phoneNumber: Joi.string().min(1),
});

const getSearchResultDetailsSchema = Joi.object({
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

module.exports = {
  importUserContactsSchema,
  searchByNameSchema,
  searchByPhoneNumberSchema,
  getSearchResultDetailsSchema,
};
