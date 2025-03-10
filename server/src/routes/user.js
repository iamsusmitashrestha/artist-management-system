import { StatusCodes } from "http-status-codes";

import { METHOD, ROLES } from "../constants/common.js";
import { requireRole } from "../middleware/auth.js";

export function handleUserRoutes(req, res) {
  verifyToken(req, res, () => {
    if (req.method === METHOD.GET && req.url === "/users") {
      requireRole([ROLES.SUPER_ADMIN])(req, res, () => {
        res.writeHead(StatusCodes.OK, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "List of users" }));
      });
    } else if (req.method === METHOD.POST && req.url === "/users") {
      requireRole([ROLES.SUPER_ADMIN])(req, res, () => {
        res.writeHead(StatusCodes.CREATED, {
          "Content-Type": "application/json",
        });
        res.end(
          JSON.stringify({ message: "User created" })
        );
      });
    } else if (req.method === METHOD.PUT && req.url.startsWith("/users/")) {
      requireRole([ROLES.SUPER_ADMIN])(req, res, () => {
        res.writeHead(StatusCodes.OK, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "User updated" }));
      });
    } else if (req.method === METHOD.DELETE && req.url.startsWith("/users/")) {
      requireRole([ROLES.SUPER_ADMIN])(req, res, () => {
        res.writeHead(StatusCodes.OK, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "User deleted" }));
      });
    } else {
      res.writeHead(StatusCodes.NOT_FOUND, {
        "Content-Type": "application/json",
      });
      res.end(JSON.stringify({ error: "User Route Not Found" }));
    }
  });
}
