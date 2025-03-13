import { StatusCodes } from "http-status-codes";

import { parseRequestBody } from "../utils/parse.js";
import * as songService from "../services/song.js";
import { buildPageParams } from "../utils/pagination.js";

// Create a new Song
export async function createSong(req, res) {
  try {
    const body = await parseRequestBody(req);
    await songService.createSong(body);

    res.writeHead(StatusCodes.CREATED, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Song created successfully" }));
  } catch (error) {
    res.writeHead(StatusCodes.BAD_REQUEST, {
      "Content-Type": "application/json",
    });
    res.end(JSON.stringify({ error: error.message }));
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
      res.writeHead(StatusCodes.NOT_FOUND, {
        "Content-Type": "application/json",
      });
      res.end(JSON.stringify({ message: "Song not found" }));
      return;
    }

    const body = await parseRequestBody(req);
    const song = await songService.updateSong(songId, body);

    res.writeHead(StatusCodes.OK, { "Content-Type": "application/json" });
    res.end(JSON.stringify(song));
  } catch (error) {
    res.writeHead(StatusCodes.BAD_REQUEST, {
      "Content-Type": "application/json",
    });
    res.end(JSON.stringify({ error: error.message }));
  }
}

// Delete Song
export async function deleteSong(req, res, songId) {
  try {
    const existingSong = await songService.getSong(songId);

    if (!existingSong) {
      res.writeHead(StatusCodes.NOT_FOUND, {
        "Content-Type": "application/json",
      });
      res.end(JSON.stringify({ message: "Song not found" }));
      return;
    }

    await songService.deleteSong(songId);

    res.writeHead(StatusCodes.OK, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Song deleted successfully" }));
  } catch (error) {
    res.writeHead(StatusCodes.BAD_REQUEST, {
      "Content-Type": "application/json",
    });
    res.end(JSON.stringify({ error: error.message }));
  }
}
