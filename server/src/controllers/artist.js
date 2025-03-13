import { StatusCodes } from "http-status-codes";

import { parseRequestBody } from "../utils/parse.js";
import * as artistService from "../services/artist.js";
import { buildPageParams } from "../utils/pagination.js";

export async function createArtist(req, res) {
  try {
    const body = await parseRequestBody(req);
    await artistService.createArtist(body);

    res.writeHead(StatusCodes.CREATED, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Artist created successfully" }));
  } catch (error) {
    res.writeHead(StatusCodes.BAD_REQUEST, {
      "Content-Type": "application/json",
    });
    res.end(JSON.stringify({ error: error.message }));
  }
}

// Get all artists
export async function getAllArtists(req, res) {
  try {
    const { page, size } = buildPageParams(req);

    const artists = await artistService.getAllArtists(page, size);

    res.writeHead(StatusCodes.OK, { "Content-Type": "application/json" });
    res.end(JSON.stringify(artists));
  } catch (error) {
    res.writeHead(StatusCodes.BAD_REQUEST, {
      "Content-Type": "application/json",
    });
    res.end(JSON.stringify({ error: error.message }));
  }
}

// Update Artist
export async function updateArtist(req, res, artistId) {
  try {
    const existingArtist = await artistService.getArtist(artistId);

    if (!existingArtist) {
      res.writeHead(StatusCodes.NOT_FOUND, {
        "Content-Type": "application/json",
      });
      res.end(JSON.stringify({ message: "Artist not found" }));
      return;
    }
    const body = await parseRequestBody(req);
    const artist = await artistService.updateArtist(artistId, body);

    res.writeHead(StatusCodes.OK, { "Content-Type": "application/json" });
    res.end(JSON.stringify(artist));
  } catch (error) {
    res.writeHead(StatusCodes.BAD_REQUEST, {
      "Content-Type": "application/json",
    });
    res.end(JSON.stringify({ error: error.message }));
  }
}

// Delete Artist
export async function deleteArtist(req, res, artistId) {
  try {
    const existingArtist = await artistService.getArtist(artistId);

    if (!existingArtist) {
      res.writeHead(StatusCodes.NOT_FOUND, {
        "Content-Type": "application/json",
      });
      res.end(JSON.stringify({ message: "Artist not found" }));
      return;
    }

    await artistService.deleteArtist(artistId);

    res.writeHead(StatusCodes.OK, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Artist deleted successfully" }));
  } catch (error) {
    res.writeHead(StatusCodes.BAD_REQUEST, {
      "Content-Type": "application/json",
    });
    res.end(JSON.stringify({ error: error.message }));
  }
}
