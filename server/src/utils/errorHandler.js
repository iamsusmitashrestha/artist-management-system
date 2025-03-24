export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function handleError(res, error) {
  const statusCode = error.statusCode || 500; // Default to 500 if no status code is provided
  const message = error.message || "Internal Server Error";

  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      success: false,
      message,
    })
  );
}
