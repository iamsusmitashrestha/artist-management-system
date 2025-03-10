import { StatusCodes } from "http-status-codes";

import { METHOD, ROLES } from "../constants/common.js";
import { verifyToken,requireRole } from "../middleware/auth.js";

export function handleArtistRoutes(req, res) {
  verifyToken(req, res, () => {
    if (req.method === METHOD.GET && req.url === "/artists") {
      requireRole([ROLES.SUPER_ADMIN, ROLES.ARTIST_MANAGER])(req, res, () => {
        res.writeHead(StatusCodes.OK, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "List of artists" }));
      });
    } else if (req.method === METHOD.POST && req.url === "/artists") {
      requireRole([ROLES.ARTIST_MANAGER])(req, res, () => {
        res.writeHead(StatusCodes.CREATED, {
          "Content-Type": "application/json",
        });
        res.end(JSON.stringify({ message: "Artist created" }));
      });
    } else if (req.method === METHOD.PUT && req.url.startsWith("/artists/")) {
      requireRole([ROLES.ARTIST_MANAGER])(req, res, () => {
        res.writeHead(StatusCodes.OK, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Artist updated" }));
      });
    } else if (
      req.method === METHOD.DELETE &&
      req.url.startsWith("/artists/")
    ) {
      requireRole([ROLES.ARTIST_MANAGER])(req, res, () => {
        res.writeHead(StatusCodes.OK, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Artist deleted" }));
      });
    } else {
      res.writeHead(StatusCodes.NOT_FOUND, {
        "Content-Type": "application/json",
      });
      res.end(JSON.stringify({ error: "Artist Route Not Found" }));
    }
  });
}
