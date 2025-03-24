import { StatusCodes } from "http-status-codes";

import { parseRequestBody } from "../utils/parse.js";
import * as artistService from "../services/artist.js";
import { buildPageParams } from "../utils/pagination.js";
import { handleError } from "../utils/errorHandler.js";
import { createUser } from "../services/auth.js";
import { ROLES } from "../constants/common.js";

export async function createArtist(req, res) {
  try {
    const body = await parseRequestBody(req);
    await artistService.validateArtist(body);
    const artist = await artistService.createArtist(body);

    // create user with role artist
    const userData = {
      firstName: `${body.name}.split(" ")[0]`,
      lastName: `${body.name}.split(" ")[1]`,
      email: body.email,
      password: body.password || "Password1",
      phone: body.phone || "9856345627",
      dob: body.dob,
      gender: body.gender,
      address: body.address,
      role: ROLES.ARTIST,
      artistId: artist.id,
    };

    await createUser(userData, true);
    res.writeHead(StatusCodes.CREATED, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Artist created successfully" }));
  } catch (error) {
    handleError(res, error);
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
    handleError(res, error);
  }
}

// Get artist by ID
export async function getArtistById(req, res, artistId) {
  try {
    const artist = await artistService.getArtist(artistId);

    res.writeHead(StatusCodes.OK, { "Content-Type": "application/json" });
    res.end(JSON.stringify(artist));
  } catch (error) {
    handleError(res, error);
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
    handleError(res, error);
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
    handleError(res, error);
  }
}

export async function importArtists(req, res) {
  try {
    const body = await parseRequestBody(req);
    await artistService.importArtists(body);

    res.writeHead(StatusCodes.CREATED, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Artists imported successfully" }));
  } catch (error) {
    handleError(res, error);
  }
}
