import Joi from "joi";

export const songSchema = Joi.object({
  artistId: Joi.number().integer().required(),
  title: Joi.string().max(255).required(),
  albumName: Joi.string().max(255).allow(null, ""),
  genre: Joi.string()
    .valid("rnb", "country", "classic", "rock", "jazz")
    .required(),
});
