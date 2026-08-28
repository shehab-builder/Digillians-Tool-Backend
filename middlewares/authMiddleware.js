import jwt from "jsonwebtoken";
import { prisma } from "../lib/db.js";
import { catchAsync } from "../utils/catchAsync.js";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-change-this";

// ==========================================
// 1. PROTECT ROUTE (VERIFY TOKEN & USER)
// ==========================================
export const protect = catchAsync(async (req, res, next) => {
  let token;

  // 1. Extract token from Cookies or Authorization Header
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // 2. Check if token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "You are not logged in. Please log in to gain access.",
    });
  }

  // 3. Verify JWT token payload
  const decoded = jwt.verify(token, JWT_SECRET);

  // 4. Verify user exists in the corresponding table
  let currentUser = null;

  if (decoded.role === "ADMIN") {
    currentUser = await prisma.admin.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        username: true,
      },
    });
  } else if (decoded.role === "JUDGE") {
    currentUser = await prisma.judge.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        username: true,
        lab: { select: { id: true, code: true } },
      },
    });
  }

  // 5. If user was deleted after token was issued
  if (!currentUser) {
    return res.status(401).json({
      success: false,
      message: "The user belonging to this token no longer exists.",
    });
  }

  // 6. Grant access by attaching user metadata to request object
  req.user = {
    ...currentUser,
    role: decoded.role,
    labId: decoded.role === "JUDGE" ? currentUser.lab?.id || null : null,
  };

  next();
});

// ==========================================
// 2. RESTRICT ROUTE BY ROLE
// ==========================================
export const restrictTo = (...allowedRoles) => {
  return (req, res, next) => {
    // req.user must be set by protect middleware prior to calling restrictTo
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action.",
      });
    }
    next();
  };
};
