import { StatusCodes } from "http-status-codes";

import { parseRequestBody } from "../utils/parse.js";
import * as songService from "../services/song.js";
import { buildPageParams } from "../utils/pagination.js";
import { AppError, handleError } from "../utils/errorHandler.js";

// Create a new Song
export async function createSong(req, res) {
  try {
    const body = await parseRequestBody(req);
    await songService.createSong(body);

    res.writeHead(StatusCodes.CREATED, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Song created successfully" }));
  } catch (error) {
    handleError(res, error);
  }
}

// Get all Songs
export async function getAllSongs(req, res) {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const artistId = parseInt(url.searchParams.get("artistId"));

    const { page, size } = buildPageParams(req);
    const songs = await songService.getAllSongs(artistId, page, size);

    res.writeHead(StatusCodes.OK, { "Content-Type": "application/json" });
    res.end(JSON.stringify(songs));
  } catch (error) {
    res.writeHead(StatusCodes.BAD_REQUEST, {
      "Content-Type": "application/json",
    });
    res.end(JSON.stringify({ error: error.message }));
  }
}

// Update Song
export async function updateSong(req, res, songId) {
  try {
    const existingSong = await songService.getSong(songId);

    if (!existingSong) {
      throw new AppError("Song not found", StatusCodes.NOT_FOUND);
    }

    const body = await parseRequestBody(req);
    const song = await songService.updateSong(songId, body);

    res.writeHead(StatusCodes.OK, { "Content-Type": "application/json" });
    res.end(JSON.stringify(song));
  } catch (error) {
    handleError(res, error);
  }
}

// Delete Song
export async function deleteSong(req, res, songId) {
  try {
    const existingSong = await songService.getSong(songId);

    if (!existingSong) {
      throw new AppError("Song not found", StatusCodes.NOT_FOUND);
    }

    await songService.deleteSong(songId);

    res.writeHead(StatusCodes.OK, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Song deleted successfully" }));
  } catch (error) {
    handleError(res, error);
  }
}
