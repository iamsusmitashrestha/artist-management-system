import { StatusCodes } from "http-status-codes";

import { createUser, login } from "../services/auth.js";
import logger from "../utils/logger.js";
import { parseRequestBody } from "../utils/parse.js";
import { handleError } from "../utils/errorHandler.js";

// Create User
export async function registerUser(req, res) {
  try {
    const body = await parseRequestBody(req);

    await createUser(body);

    res.writeHead(StatusCodes.CREATED, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "User created successfully" }));
  } catch (error) {
    logger.error("Error:", error.message);

    handleError(res, error);
  }
}

export async function loginUser(req, res) {
  try {
    const body = await parseRequestBody(req);

    const result = await login(body);

    res.writeHead(StatusCodes.OK, { "Content-Type": "application/json" });
    res.end(JSON.stringify(result));
  } catch (error) {
    logger.error("Error:", error.message);

    handleError(res, error);
  }
}
