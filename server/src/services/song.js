import { songSchema } from "../schema/song.js";
import * as songModel from "../models/song.js";
import { getMeta } from "../utils/pagination.js";

// Create Song
export async function createSong(songData) {
  const { error } = songSchema.validate(songData);
  if (error) throw new Error(error.details[0].message);

  return songModel.create(songData);
}

// Get a Song by ID
export async function getSong(songId) {
  return songModel.get(songId);
}

// Get All Songs
export async function getAllSongs(artistId, page, size) {
  const { data, count } = await songModel.getAll(artistId, page, size);

  const meta = getMeta(page, size, count);

  return { data, meta };
}

// Update Song
export async function updateSong(songId, songData) {
  const { error } = songSchema.validate(songData);
  if (error) throw new Error(error.details[0].message);

  await songModel.update(songId, songData);

  return songModel.get(songId);
}

// Delete Song
export async function deleteSong(songId) {
  return songModel.deleteSong(songId);
}
