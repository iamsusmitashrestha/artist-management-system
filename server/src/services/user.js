import bcrypt from "bcryptjs";
import validator from "validator";
import { create, getUserByEmail } from "../models/user.js";

/**
 * Registers a new user.
 * @param {Object} userData - User details.
 * @returns {Promise}
 */
export async function createUser(userData) {
  const { password, email } = userData;

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    throw Error(`User with email: ${email} already exists`);
  }

  validateUserData(userData);

  // Hash password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  return create({ ...userData, password: hashedPassword });
}

/**
 * Validates user input.
 * @param {Object} userData - User details.
 * @throws {Error} If validation fails.
 */
function validateUserData(userData) {
  const {
    firstName,
    lastName,
    email,
    password,
    phone,
    dob,
    gender,
    address,
    role,
  } = userData;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !phone ||
    !dob ||
    !gender ||
    !address ||
    !role
  ) {
    throw new Error("All fields are required");
  }

  if (!validator.isEmail(email)) {
    throw new Error("Invalid email format");
  }

  if (!validator.isStrongPassword(password, { minLength: 8, minNumbers: 1 })) {
    throw new Error(
      "Password must be at least 8 characters long and include a number"
    );
  }

  if (!validator.isMobilePhone(phone, "any", { strictMode: true })) {
    throw new Error("Invalid phone number");
  }

  if (!["M", "F", "O"].includes(gender.toUpperCase())) {
    throw new Error("Invalid gender value. Allowed: M, F, O");
  }
}
