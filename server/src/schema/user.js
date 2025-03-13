import Joi from "joi";
import { ROLES } from "../constants/common.js";

export const userSchema = Joi.object({
    firstName: Joi.string().max(255).required(),
    lastName: Joi.string().max(255).required(),
    email: Joi.string().email().max(255).required(),
    password: Joi.string().min(6).max(500).required(),
    phone: Joi.string().max(20).required(),
    dob: Joi.date().iso().required(),
    gender: Joi.string().valid("M", "F", "O").required(),
    address: Joi.string().max(255).required(),
    role: Joi.string().valid(ROLES.SUPER_ADMIN,ROLES.ARTIST,ROLES.ARTIST_MANAGER).required()
});

export const updateUserSchema = userSchema.fork(["password"], (schema) => schema.optional());

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});
