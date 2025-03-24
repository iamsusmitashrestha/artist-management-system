import { StatusCodes } from "http-status-codes";

import { METHOD, ROLES } from "../constants/common.js";
import { verifyToken, requireRole } from "../middleware/auth.js";
import {
  createArtist,
  deleteArtist,
  getAllArtists,
  getArtistById,
  importArtists,
  updateArtist,
} from "../controllers/artist.js";

export function handleArtistRoutes(req, res) {
  verifyToken(req, res, () => {
    if (
      req.method === METHOD.GET &&
      req.url.startsWith("/artists") &&
      !/^\/artists\/\d+$/.test(req.url)
    ) {
      requireRole([ROLES.SUPER_ADMIN, ROLES.ARTIST_MANAGER])(
        req,
        res,
        async () => {
          await getAllArtists(req, res);
        }
      );
    } else if (req.method === METHOD.GET && /^\/artists\/\d+$/.test(req.url)) {
      requireRole([ROLES.SUPER_ADMIN, ROLES.ARTIST_MANAGER, ROLES.ARTIST])(
        req,
        res,
        async () => {
          const userId = req.url.split("/")[2];

          await getArtistById(req, res, userId);
        }
      );
    } else if (req.method === METHOD.POST && req.url === "/artists") {
      requireRole([ROLES.ARTIST_MANAGER])(req, res, async () => {
        await createArtist(req, res);
      });
    } else if (req.method === METHOD.PUT && req.url.startsWith("/artists/")) {
      requireRole([ROLES.ARTIST_MANAGER])(req, res, async () => {
        const artistId = req.url.split("/")[2];

        await updateArtist(req, res, artistId);
      });
    } else if (
      req.method === METHOD.DELETE &&
      req.url.startsWith("/artists/")
    ) {
      requireRole([ROLES.ARTIST_MANAGER])(req, res, async () => {
        const artistId = req.url.split("/")[2];

        await deleteArtist(req, res, artistId);
      });
    } else if (req.method === METHOD.POST && req.url === "/artists/import") {
      requireRole([ROLES.ARTIST_MANAGER])(req, res, async () => {
        await importArtists(req, res);
      });
    } else {
      res.writeHead(StatusCodes.NOT_FOUND, {
        "Content-Type": "application/json",
      });
      res.end(JSON.stringify({ error: "Artist Route Not Found" }));
    }
  });
}
