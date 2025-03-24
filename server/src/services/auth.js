import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { create, getUserByEmail } from "../models/user.js";
import { loginSchema, userSchema } from "../schema/user.js";
import { AppError } from "../utils/errorHandler.js";
import { createArtist } from "./artist.js";
import { ROLES } from "../constants/common.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "jwt_secret";

/**
 * Registers a new user.
 * @param {Object} userData - User details.
 * @returns {Promise}
 */
export async function createUser(userData, skipArtist = false) {
  const { password, email } = userData;

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    throw Error(`User with email: ${email} already exists`);
  }

  const { error } = userSchema.validate(userData);
  if (error) throw new AppError(error.details[0].message, 400);

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  if (!skipArtist && userData.role === ROLES.ARTIST) {
    const artistData = {
      name: userData.firstName + " " + userData.lastName,
      dob: userData.dob,
      email: userData.email,
      gender: userData.gender,
      address: userData.address,
      firstReleaseYear: new Date().getFullYear(),
      noOfAlbumsReleased: 0,
    };

    const artist = await createArtist(artistData);

    return create({
      ...userData,
      password: hashedPassword,
      artistId: artist.id,
    });
  }

  return create({
    ...userData,
    password: hashedPassword,
  });
}

export async function login(userData) {
  const { password, email } = userData;

  // Validate
  const { error } = loginSchema.validate(userData);
  if (error) throw new AppError(error.details[0].message, 400);

  const user = await getUserByEmail(email);

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  // Generate JWT
  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: "12h",
  });

  return {
    message: "Login successful",
    token,
    role: user.role,
    artistId: user.artist_id,
  };
}
