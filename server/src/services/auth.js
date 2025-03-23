import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { create, getUserByEmail } from "../models/user.js";
import { loginSchema, userSchema } from "../schema/user.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "jwt_secret";

/**
 * Registers a new user.
 * @param {Object} userData - User details.
 * @returns {Promise}
 */
export async function createUser(userData) {
  const { password, email, role } = userData;

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    throw Error(`User with email: ${email} already exists`);
  }

  const { error } = userSchema.validate(userData);
  if (error) throw new Error(error.details[0].message);

  // Hash password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  if (role === "artist") {
  }
  return create({ ...userData, password: hashedPassword });
}

export async function login(userData) {
  const { password, email } = userData;

  // Validate
  const { error } = loginSchema.validate(userData);
  if (error) throw new Error(error.details[0].message);

  const user = await getUserByEmail(email);

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid email or password");

  // Generate JWT
  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: "12h",
  });

  return { message: "Login successful", token, role: user.role, id: user.id };
}
