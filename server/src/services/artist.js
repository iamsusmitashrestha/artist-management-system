import { artistSchema } from "../schema/artist.js";
import * as artistModel from "../models/artist.js";
import { getMeta } from "../utils/pagination.js";
import { AppError } from "../utils/errorHandler.js";
import { deleteSongByArtistId } from "../models/song.js";
import { deleteUserByArtistId } from "../models/user.js";

export async function createArtist(artistData) {
  const { error } = artistSchema.validate(artistData);
  if (error) throw new Error(error.details[0].message);

  const artist = await artistModel.create(artistData);
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

  return artistModel.validateArtist(artistData);
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
  await artistModel.deleteArtist(artistId);

  await deleteSongByArtistId(artistId);

  return deleteUserByArtistId(artistId);
}
