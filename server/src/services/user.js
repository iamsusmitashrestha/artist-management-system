import * as userModel from "../models/user.js";
import { getMeta } from "../utils/pagination.js";
import { updateUserSchema } from "../schema/user.js";
import { AppError } from "../utils/errorHandler.js";

export async function getAllUsers(page, size) {
  const { data, count } = await userModel.getAllUsers(page, size);

  const meta = getMeta(page, size, count);

  return { data, meta };
}

/**
 * Get user by ID
 */
export async function getUserById(userId) {
  return userModel.getUserById(userId);
}

// get user by email
export async function getUserByEmail(email) {
  return userModel.getUserByEmail(email);
}

/**
 * Update user by ID
 */
export async function updateUser(userId, updatedData) {
  const { error } = updateUserSchema.validate(updatedData);
  if (error) {
    throw new AppError(error.details[0].message, 400);
  }

  await userModel.updateUser(userId, updatedData);

  return getUserById(userId);
}

/**
 * Delete user by ID
 */
export async function deleteUser(userId) {
  return userModel.deleteUser(userId);
}
