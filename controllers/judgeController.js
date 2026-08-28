import bcrypt from "bcryptjs";
import { prisma } from "../lib/db.js";
import { catchAsync } from "../utils/catchAsync.js";
import { APIFeatures } from "../utils/apiFeatures.js";
import { AppError } from "../utils/appError.js";

// Utility to exclude fields (like passwordHash) from returned objects
function omitPassword(judge) {
  if (!judge) return null;
  const { passwordHash, ...judgeWithoutPassword } = judge;
  return judgeWithoutPassword;
}

// ==========================================
// 1. CREATE JUDGE
// ==========================================
export const createJudge = catchAsync(async (req, res, next) => {
  const { name, title, username, password, labId } = req.body;

  if (!name || !username || !password) {
    return next(
      new AppError("Please provide name, username, and password.", 400),
    );
  }

  // Check username uniqueness
  const existingJudge = await prisma.judge.findUnique({ where: { username } });
  if (existingJudge) {
    return next(new AppError("Username is already taken.", 400));
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10);

  // Transactionally create judge and assign to lab if labId is provided
  const newJudge = await prisma.$transaction(async (tx) => {
    const judge = await tx.judge.create({
      data: {
        name,
        title: title || null,
        username,
        passwordHash,
      },
    });

    if (labId) {
      await tx.lab.update({
        where: { id: labId },
        data: { judgeId: judge.id },
      });
    }

    return tx.judge.findUnique({
      where: { id: judge.id },
      include: { lab: true },
    });
  });

  return res.status(201).json({
    success: true,
    message: "Judge created successfully.",
    data: omitPassword(newJudge),
  });
});

// ==========================================
// 2. GET ALL JUDGES (WITH FILTERING & PAGINATION)
// ==========================================
export const getAllJudges = catchAsync(async (req, res) => {
  // Extract custom available flag before APIFeatures processes query params
  const { available, currentLabId } = req.query;

  const features = new APIFeatures(req.query).filter().select().sort();

  // Handle availability filter logic
  if (available === "true") {
    if (currentLabId) {
      features.prismaOptions.where.OR = [
        { lab: null },
        { lab: { id: currentLabId } },
      ];
    } else {
      features.prismaOptions.where.lab = null;
    }
  }

  // Set default includes if no custom selection was provided
  if (!features.prismaOptions.select) {
    features.prismaOptions.include = {
      lab: {
        select: {
          id: true,
          code: true,
          building: true,
          floor: true,
          track: { select: { id: true, name: true } },
        },
      },
    };
  }

  // Default sorting by name
  if (!features.prismaOptions.orderBy) {
    features.prismaOptions.orderBy = { name: "asc" };
  }

  const [judges, totalCount] = await Promise.all([
    prisma.judge.findMany(features.prismaOptions),
    prisma.judge.count({ where: features.prismaOptions.where }),
  ]);

  const cleanedJudges = judges.map(omitPassword);

  return res.status(200).json({
    success: true,
    count: cleanedJudges.length,
    data: cleanedJudges,
  });
});

// ==========================================
// 3. GET JUDGE BY ID
// ==========================================
export const getJudgeById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const judge = await prisma.judge.findUnique({
    where: { id },
    include: {
      lab: {
        include: {
          track: true,
          schedulledEvaluations: {
            include: { team: true },
            orderBy: { sequenceNo: "asc" },
          },
        },
      },
      projectsEvaluations: true,
      studentsEvaluations: true,
    },
  });

  if (!judge) {
    return next(new AppError("Judge not found.", 404));
  }

  return res.status(200).json({
    success: true,
    data: omitPassword(judge),
  });
});

// ==========================================
// 4. UPDATE JUDGE
// ==========================================
export const updateJudge = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name, title, username, password, labId } = req.body;

  const existingJudge = await prisma.judge.findUnique({ where: { id } });
  if (!existingJudge) {
    return next(new AppError("Judge not found.", 404));
  }

  let passwordHash = undefined;
  if (password) {
    passwordHash = await bcrypt.hash(password, 10);
  }

  const updatedJudge = await prisma.$transaction(async (tx) => {
    await tx.judge.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(title !== undefined && { title }),
        ...(username && { username }),
        ...(passwordHash && { passwordHash }),
      },
    });

    if (labId !== undefined) {
      await tx.lab.updateMany({
        where: { judgeId: id },
        data: { judgeId: null },
      });

      if (labId) {
        await tx.lab.update({
          where: { id: labId },
          data: { judgeId: id },
        });
      }
    }

    return tx.judge.findUnique({
      where: { id },
      include: { lab: true },
    });
  });

  return res.status(200).json({
    success: true,
    message: "Judge updated successfully.",
    data: omitPassword(updatedJudge),
  });
});

// ==========================================
// 5. DELETE JUDGE
// ==========================================
export const deleteJudge = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const existingJudge = await prisma.judge.findUnique({ where: { id } });
  if (!existingJudge) {
    return next(new AppError("Judge not found.", 404));
  }

  await prisma.judge.delete({ where: { id } });

  return res.status(200).json({
    success: true,
    message: "Judge deleted successfully.",
  });
});

// ==========================================
// 6. GET CURRENT JUDGE PROFILE
// ==========================================
export const getMyInfo = catchAsync(async (req, res, next) => {
  const judgeId = req.user.id;

  console.log("A7a7");

  const judge = await prisma.judge.findUnique({
    where: { id: judgeId },
    include: {
      lab: {
        include: {
          track: {
            select: { id: true, name: true },
          },
        },
      },
    },
  });

  if (!judge) {
    return next(new AppError("Judge profile not found.", 404));
  }
  console.log(judge);

  return res.status(200).json({
    success: true,
    data: omitPassword(judge),
  });
});

// ==========================================
// 7. GET LOGGED-IN JUDGE'S SCHEDULED EVALUATIONS
// ==========================================
export const getAllMySchedulledEvaluations = catchAsync(
  async (req, res, next) => {
    const judgeId = req.user.id;

    // 1. Fetch the lab assigned to this judge
    const assignedLab = await prisma.lab.findFirst({
      where: { judgeId },
      select: { id: true, code: true, building: true, floor: true },
    });

    if (!assignedLab) {
      return res.status(200).json({
        success: true,
        message: "You are not assigned to any lab currently.",
        count: 0,
        lab: null,
        data: [],
      });
    }

    // 2. Fetch scheduled evaluations in this lab ordered by sequence
    const scheduledEvaluations = await prisma.schedulledEvaluation.findMany({
      where: { labId: assignedLab.id },
      include: {
        team: {
          include: {
            track: { select: { id: true, name: true } },
            students: {
              select: {
                id: true,
                fullName: true,
                studentCode: true,
              },
            },
          },
        },
      },
      orderBy: { sequenceNo: "asc" },
    });

    console.log("Look", scheduledEvaluations);

    return res.status(200).json({
      success: true,
      count: scheduledEvaluations.length,
      lab: assignedLab,
      data: scheduledEvaluations,
    });
  },
);
