import { StatusCodes } from "http-status-codes";
import { parseRequestBody } from "../utils/parse.js";
import * as userService from "../services/user.js";
import { buildPageParams } from "../utils/pagination.js";

/**
 * Get all users
 */
export async function getAllUsers(req, res) {
  try {
    const { page, size } = buildPageParams(req);

    const users = await userService.getAllUsers(page, size);

    res.writeHead(StatusCodes.OK, { "Content-Type": "application/json" });
    res.end(JSON.stringify(users));
  } catch (error) {
    res.writeHead(StatusCodes.BAD_REQUEST, {
      "Content-Type": "application/json",
    });
    res.end(JSON.stringify({ error: error.message }));
  }
}

// Get user by ID
export async function getUserById(req, res, userId) {
  try {
    const user = await userService.getUserById(userId);

    res.writeHead(StatusCodes.OK, { "Content-Type": "application/json" });
    res.end(JSON.stringify(user));
  } catch (error) {
    res.writeHead(StatusCodes.BAD_REQUEST, {
      "Content-Type": "application/json",
    });
    res.end(JSON.stringify({ error: error.message }));
  }
}

/**
 * Update user by ID
 */
export async function updateUser(req, res, userId) {
  try {
    const existingUser = await userService.getUserById(userId);

    if (!existingUser) {
      res.writeHead(StatusCodes.NOT_FOUND, {
        "Content-Type": "application/json",
      });
      res.end(JSON.stringify({ message: "User not found" }));
      return;
    }

    const body = await parseRequestBody(req);
    const user = await userService.updateUser(userId, body);

    res.writeHead(StatusCodes.OK, { "Content-Type": "application/json" });
    res.end(JSON.stringify(user));
  } catch (error) {
    res.writeHead(StatusCodes.BAD_REQUEST, {
      "Content-Type": "application/json",
    });
    res.end(JSON.stringify({ error: error.message }));
  }
}

/**
 * Delete user by ID
 */
export async function deleteUser(req, res, userId) {
  try {
    const existingUser = await userService.getUserById(userId);

    if (!existingUser) {
      res.writeHead(StatusCodes.NOT_FOUND, {
        "Content-Type": "application/json",
      });
      res.end(JSON.stringify({ message: "User not found" }));
      return;
    }

    const message = await userService.deleteUser(userId);

    res.writeHead(StatusCodes.OK, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message }));
  } catch (error) {
    res.writeHead(StatusCodes.BAD_REQUEST, {
      "Content-Type": "application/json",
    });
    res.end(JSON.stringify({ error: error.message }));
  }
}
