import { artistSchema } from "../schema/artist.js";
import * as artistModel from "../models/artist.js";
import { getMeta } from "../utils/pagination.js";

export async function createArtist(artistData) {
  const { error } = artistSchema.validate(artistData);
  if (error) throw new Error(error.details[0].message);

  return artistModel.create(artistData);
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
  if (error) throw new Error(error.details[0].message);

  await artistModel.update(artistId, artistData);

  return artistModel.get(artistId);
}

// Delete Artist
export async function deleteArtist(artistId) {
  return artistModel.deleteArtist(artistId);
}

export async function importArtists(artists) {
  for (const artist of artists) {
    const { error } = artistSchema.validate(artist);
    if (error) throw new Error(error.details[0].message);

    await artistModel.create(artist);
  }
}
