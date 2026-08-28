import { AppError } from "../utils/appError.js";

// Handle specific Prisma database errors
const handlePrismaError = (err) => {
  // P2002: Unique constraint failed
  if (err.code === "P2002") {
    const fields = err.meta?.target ? err.meta.target.join(", ") : "field";
    return new AppError(`A record with this ${fields} already exists.`, 400);
  }

  // P2025: Record to update/delete not found
  if (err.code === "P2025") {
    return new AppError("The requested record was not found.", 404);
  }

  // P2003: Foreign key constraint failed
  if (err.code === "P2003") {
    return new AppError(
      "Invalid reference ID provided for related record.",
      400,
    );
  }

  // Invalid UUID or data type error
  if (err.code === "P2006" || err.message?.includes("Invalid UUID")) {
    return new AppError("Invalid ID format provided.", 400);
  }

  return new AppError("Database operation failed.", 500);
};

// Handle JWT authentication errors
const handleJWTError = () =>
  new AppError("Invalid token. Please log in again.", 401);

const handleJWTExpiredError = () =>
  new AppError("Your session has expired. Please log in again.", 401);

// Send detailed errors in Development mode
const sendErrorDev = (err, res) => {
  return res.status(err.statusCode || 500).json({
    success: false,
    status: err.status || "error",
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

// Send clean errors in Production mode
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
    });
  }

  // Programming or unknown error: don't leak error details
  console.error("💥 ERROR 💥:", err);
  return res.status(500).json({
    success: false,
    status: "error",
    message: "Something went wrong on the server.",
  });
};

// Main Error Middleware
export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else {
    let error = {
      ...err,
      message: err.message,
      name: err.name,
      code: err.code,
    };

    if (error.code && error.code.startsWith("P"))
      error = handlePrismaError(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};
