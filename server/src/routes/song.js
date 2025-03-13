import { StatusCodes } from "http-status-codes";

import { METHOD, ROLES } from "../constants/common.js";
import { verifyToken, requireRole } from "../middleware/auth.js";
import {
  createSong,
  deleteSong,
  getAllSongs,
  updateSong,
} from "../controllers/song.js";

export function handleSongRoutes(req, res) {
  verifyToken(req, res, () => {
    if (req.method === METHOD.GET && req.url.startsWith("/songs")) {
      requireRole([ROLES.SUPER_ADMIN, ROLES.ARTIST_MANAGER, ROLES.ARTIST])(
        req,
        res,
        async () => {
          await getAllSongs(req, res);
        }
      );
    } else if (req.method === METHOD.POST && req.url === "/songs") {
      requireRole([ROLES.ARTIST])(req, res, async () => {
        await createSong(req, res);
      });
    } else if (req.method === METHOD.PUT && req.url.startsWith("/songs/")) {
      requireRole([ROLES.ARTIST])(req, res, async () => {
        const songId = req.url.split("/")[2];

        await updateSong(req, res, songId);
      });
    } else if (req.method === METHOD.DELETE && req.url.startsWith("/songs/")) {
      requireRole([ROLES.ARTIST])(req, res, async () => {
        const songId = req.url.split("/")[2];

        await deleteSong(req, res, songId);
      });
    } else {
      res.writeHead(StatusCodes.NOT_FOUND, {
        "Content-Type": "application/json",
      });
      res.end(JSON.stringify({ error: "Song Route Not Found" }));
    }
  });
}
