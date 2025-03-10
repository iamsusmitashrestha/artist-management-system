import { StatusCodes } from "http-status-codes";

import { METHOD, ROLES } from "../constants/common.js";
import { requireRole, verifyToken } from "../middleware/auth.js";

export function handleMusicRoutes(req, res) {
  verifyToken(req, res, () => {
    if (req.method === METHOD.GET && req.url === "/musics") {
      requireRole([ROLES.SUPER_ADMIN,ROLES.ARTIST,ROLES.ARTIST_MANAGER])(req, res, () => {
        res.writeHead(StatusCodes.OK, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "List of Musics" }));
      });
    } else if (req.method === METHOD.POST && req.url === "/musics") {
      requireRole([ROLES.ARTIST])(req, res, () => {
        res.writeHead(StatusCodes.CREATED, {
          "Content-Type": "application/json",
        });
        res.end(JSON.stringify({ message: "Music created" }));
      });
    } else if (req.method === METHOD.PUT && req.url.startsWith("/musics/")) {
      requireRole([ROLES.ARTIST])(req, res, () => {
        res.writeHead(StatusCodes.OK, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Music updated" }));
      });
    } else if (req.method === METHOD.DELETE && req.url.startsWith("/musics/")) {
      requireRole([ROLES.ARTIST])(req, res, () => {
        res.writeHead(StatusCodes.OK, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Music deleted" }));
      });
    } else {
      res.writeHead(StatusCodes.NOT_FOUND, {
        "Content-Type": "application/json",
      });
      res.end(JSON.stringify({ error: "Music Route Not Found" }));
    }
  });
}
