import { artistSchema } from "../schema/artist.js";
import * as artistModel from "../models/artist.js";
import { getMeta } from "../utils/pagination.js";
import { AppError } from "../utils/errorHandler.js";
import { deleteSongByArtistId } from "../models/song.js";
import { deleteUserByArtistId } from "../models/user.js";
import { connection } from "../db/migrate.js";
import { createUser } from "./auth.js";
import { ROLES } from "../constants/common.js";

export async function createArtist(artistData, trx) {
  const { error } = artistSchema.validate(artistData);
  if (error) throw new Error(error.details[0].message);

  const conn = trx || connection;

  try {
    connection.beginTransaction();

    const artist = await artistModel.create(artistData, conn);

    // create user with role artist
    const userData = {
      firstName: artistData.name.split(" ")[0],
      lastName: artistData.name.split(" ")[1],
      email: artistData.email,
      password: artistData.password || "Password1",
      phone: artistData.phone || "9856345627",
      dob: artistData.dob,
      gender: artistData.gender,
      address: artistData.address,
      role: ROLES.ARTIST,
      artistId: artist.id,
    };
    createUser(userData, true, conn);

    connection.commit();

    return artist;
  } catch (error) {
    connection.rollback();
    throw new AppError(error.message, 500);
  }

  return artist;
}

export async function importArtists(artists) {
  for (const artist of artists) {
    const { error } = artistSchema.validate(artist);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    await artistModel.create(artist);
  }
}

export async function validateArtist(artistData) {
  const { error } = artistSchema.validate(artistData);
  if (error) {
    throw new AppError(error.details[0].message, 400);
  }

  // get artist by email
  const artist = await artistModel.getArtistByEmail(artistData.email);
  if (artist) {
    throw new AppError("Artist with email already exists", 400);
  }
}

// Get Artist
export async function getArtist(artistId) {
  return artistModel.get(artistId);
}

// Get All Artists
export async function getAllArtists(page, size) {
  const { data, count } = await artistModel.getAll(page, size);

  const meta = getMeta(page, size, count);

  return { data, meta };
}

// Update Artist
export async function updateArtist(artistId, artistData) {
  const { error } = artistSchema.validate(artistData);
  if (error) {
    throw new AppError(error.details[0].message, 400);
  }

  await artistModel.update(artistId, artistData);

  return artistModel.get(artistId);
}

// Delete Artist
export async function deleteArtist(artistId) {
  connection.beginTransaction();

  try {
    await deleteUserByArtistId(artistId, connection);

    await artistModel.deleteArtist(artistId, connection);

    await deleteSongByArtistId(artistId, connection);

    connection.commit();
  } catch (error) {
    connection.rollback();
    throw new AppError(error.message, 500);
  }
}
