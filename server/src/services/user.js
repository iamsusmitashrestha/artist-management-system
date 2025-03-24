import * as userModel from "../models/user.js";
import { getMeta } from "../utils/pagination.js";
import { updateUserSchema } from "../schema/user.js";
import { AppError } from "../utils/errorHandler.js";
import { deleteArtist } from "../models/artist.js";
import { deleteSongByArtistId } from "../models/song.js";
import { connection } from "../db/migrate.js";

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
  const existingUser = await userModel.getUserById(userId);

  if (!existingUser) {
    throw new AppError("Artist not found", 500);
  }

  connection.beginTransaction();

  try {
    await userModel.deleteUser(userId, connection);

    if (existingUser.artistId) {
      await deleteArtist(existingUser.artistId, connection);

      await deleteSongByArtistId(existingUser.artistId, connection);
    }

    connection.commit();
  } catch (error) {
    connection.rollback();
    throw new AppError(error.message, 500);
  }
}
