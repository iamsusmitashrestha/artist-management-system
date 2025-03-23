import { StatusCodes } from "http-status-codes";

import { METHOD, ROLES } from "../constants/common.js";
import { requireRole, verifyToken } from "../middleware/auth.js";
import { registerUser } from "../controllers/auth.js";
import {
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "../controllers/user.js";

export function handleUserRoutes(req, res) {
  verifyToken(req, res, () => {
    if (
      req.method === METHOD.GET &&
      req.url.startsWith("/users") &&
      !/^\/users\/\d+$/.test(req.url)
    ) {
      requireRole([ROLES.SUPER_ADMIN])(req, res, async () => {
        await getAllUsers(req, res);
      });
    } else if (req.method === METHOD.GET && /^\/users\/\d+$/.test(req.url)) {
      requireRole([ROLES.SUPER_ADMIN])(req, res, async () => {
        const userId = req.url.split("/")[2];

        await getUserById(req, res, userId);
      });
    } else if (req.method === METHOD.POST && req.url === "/users") {
      requireRole([ROLES.SUPER_ADMIN])(req, res, async () => {
        await registerUser(req, res);
      });
    } else if (req.method === METHOD.PUT && req.url.startsWith("/users/")) {
      requireRole([ROLES.SUPER_ADMIN])(req, res, async () => {
        const userId = req.url.split("/")[2];

        await updateUser(req, res, userId);
      });
    } else if (req.method === METHOD.DELETE && req.url.startsWith("/users/")) {
      requireRole([ROLES.SUPER_ADMIN])(req, res, async () => {
        const userId = req.url.split("/")[2];

        await deleteUser(req, res, userId);
      });
    } else {
      res.writeHead(StatusCodes.NOT_FOUND, {
        "Content-Type": "application/json",
      });
      res.end(JSON.stringify({ error: "User Route Not Found" }));
    }
  });
}
