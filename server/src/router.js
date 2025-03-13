import { StatusCodes } from "http-status-codes";
import { handleUserRoutes } from "./routes/user.js";
import { handleArtistRoutes } from "./routes/artist.js";
import { handleAuthRoutes } from "./routes/auth.js";
import { handleSongRoutes } from "./routes/song.js";

export function handleRoutes(req, res) {
  // Enable CORS (Allow frontend to call API)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle OPTIONS request for CORS preflight
  if (req.method === "OPTIONS") {
    res.writeHead(StatusCodes.NO_CONTENT);
    res.end();
    return;
  }

  // Routing
  if (req.url.startsWith("/auth")) {
    handleAuthRoutes(req, res);
  } else if (req.url.startsWith("/users")) {
    handleUserRoutes(req, res);
  } else if (req.url.startsWith("/artists")) {
    handleArtistRoutes(req, res);
  } else if (req.url.startsWith("/songs")) {
    handleSongRoutes(req, res);
  } else {
    res.writeHead(StatusCodes.NOT_FOUND, {
      "Content-Type": "application/json",
    });
    res.end(JSON.stringify({ error: "Route Not Found" }));
  }
}
