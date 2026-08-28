import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/db.js";
import { catchAsync } from "../utils/catchAsync.js";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-change-this";

// ==========================================
// 1. LOGIN
// ==========================================
export const login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;
  console.log(req.body);

  // 1. Validate inputs
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide both username and password.",
    });
  }

  let user = null;
  let role = null;

  // 2. Search in Admin table
  const admin = await prisma.admin.findUnique({
    where: { username },
  });

  if (admin) {
    user = admin;
    role = "ADMIN";
  } else {
    // 3. If not found in Admin, search in Judge table (including their assigned Lab)
    const judge = await prisma.judge.findUnique({
      where: { username },
      include: {
        lab: { select: { id: true, code: true } },
      },
    });

    if (judge) {
      user = judge;
      role = "JUDGE";
    }
  }

  // 4. User not found in either table
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid username or password.",
    });
  }

  // 5. Verify password hash
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: "Invalid username or password.",
    });
  }

  // 6. Build Token Payload with assigned Role & Lab ID
  const payload = {
    id: user.id,
    name: user.name,
    username: user.username,
    role: role,
    labId: role === "JUDGE" ? user.lab?.id || null : null,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "12h" });

  // 7. Attach HTTP-Only Cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // true in production (HTTPS)
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // 'none' required for cross-domain Vercel frontend
    maxAge: 24 * 60 * 60 * 1000,
  });

  // 8. Return response (excluding passwordHash)
  return res.status(200).json({
    success: true,
    message: "Logged in successfully.",
    token, // Included for authorization headers if needed
    data: {
      id: user.id,
      name: user.name,
      username: user.username,
      role: role,
      labId: payload.labId,
    },
  });
});

// ==========================================
// 2. GET ME (GET CURRENT USER PROFILE)
// ==========================================
export const getMe = catchAsync(async (req, res, next) => {
  // req.user is supplied by the protect middleware
  const { id, role } = req.user;

  let currentUser = null;

  if (role === "ADMIN") {
    currentUser = await prisma.admin.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        username: true,
        createdAt: true,
      },
    });
  } else if (role === "JUDGE") {
    currentUser = await prisma.judge.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        title: true,
        username: true,
        lab: {
          select: {
            id: true,
            code: true,
            building: true,
            floor: true,
            track: { select: { id: true, name: true } },
          },
        },
      },
    });
  }

  if (!currentUser) {
    return res.status(404).json({
      success: false,
      message: "User profile not found.",
    });
  }

  return res.status(200).json({
    success: true,
    data: {
      ...currentUser,
      role,
    },
  });
});

// ==========================================
// 3. LOGOUT
// ==========================================
export const logout = catchAsync(async (req, res, next) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
});
