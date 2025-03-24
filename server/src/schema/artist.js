import Joi from "joi";

export const artistSchema = Joi.object({
  name: Joi.string().max(255).required(),
  dob: Joi.date().iso().required(),
  email: Joi.string().email().max(255).required(),
  gender: Joi.string().valid("M", "F", "O").required(),
  address: Joi.string().max(255).optional(),
  firstReleaseYear: Joi.number()
    .integer()
    .max(new Date().getFullYear())
    .required(),
  noOfAlbumsReleased: Joi.number().integer().min(0).required(),
});
