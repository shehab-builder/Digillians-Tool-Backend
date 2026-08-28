import { prisma } from "../lib/db.js";
import { APIFeatures } from "../utils/apiFeatures.js";
import { catchAsync } from "../utils/catchAsync.js";

// Utility to exclude judge password hash in lab responses
function sanitizeLab(lab) {
  if (!lab) return null;
  if (lab.judge && lab.judge.passwordHash) {
    delete lab.judge.passwordHash;
  }
  return lab;
}

// ==========================================
// 1. CREATE LAB
// ==========================================
export const createLab = catchAsync(async (req, res, next) => {
  const { code, building, floor, trackId, judgeId } = req.body;

  if (!code || !trackId) {
    return res.status(400).json({
      success: false,
      message: "Please provide both lab code and trackId.",
    });
  }

  // 1. Check if track exists
  const trackExists = await prisma.track.findUnique({ where: { id: trackId } });
  if (!trackExists) {
    return res.status(404).json({
      success: false,
      message: "Track not found with the provided trackId.",
    });
  }

  // 2. Check 1-to-1 constraint for Judge if judgeId is provided
  if (judgeId) {
    const judgeExists = await prisma.judge.findUnique({
      where: { id: judgeId },
    });
    if (!judgeExists) {
      return res.status(404).json({
        success: false,
        message: "Judge not found with the provided judgeId.",
      });
    }

    const assignedLab = await prisma.lab.findUnique({ where: { judgeId } });
    if (assignedLab) {
      return res.status(400).json({
        success: false,
        message: "This judge is already assigned to another lab.",
      });
    }
  }

  const newLab = await prisma.lab.create({
    data: {
      code,
      building: building || null,
      floor: floor || null,
      trackId,
      judgeId: judgeId || null,
    },
    include: {
      track: { select: { id: true, name: true } },
      judge: { select: { id: true, name: true, title: true, username: true } },
    },
  });

  return res.status(201).json({
    success: true,
    message: "Lab created successfully.",
    data: sanitizeLab(newLab),
  });
});

// ==========================================
// 2. GET ALL LABS
// ==========================================
export const getAllLabs = catchAsync(async (req, res, next) => {
  // Base Prisma options for relations and default sorting
  const baseOptions = {
    include: {
      track: { select: { id: true, name: true } },
      judge: { select: { id: true, name: true, title: true, username: true } },
      _count: {
        select: { schedulledEvaluations: true },
      },
    },
    orderBy: { code: "asc" },
  };

  // Initialize and build APIFeatures query options
  const features = new APIFeatures(req.query).filter().sort().select();

  // Handle Prisma restriction: select and include cannot coexist at top level
  if (features.prismaOptions.select) {
    delete baseOptions.include;
  }

  // Merge features options with base configuration
  const queryOptions = {
    ...baseOptions,
    ...features.prismaOptions,
  };

  // Execute database query and total count in parallel
  const [labs, total] = await Promise.all([
    prisma.lab.findMany(queryOptions),
    prisma.lab.count({ where: queryOptions.where }),
  ]);

  const cleanedLabs = labs.map(sanitizeLab);

  const { page = 1, limit = labs.length } = features.paginationMeta || {};

  return res.status(200).json({
    success: true,
    results: cleanedLabs.length,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
    data: cleanedLabs,
  });
});
// ==========================================
// 3. GET LAB BY ID
// ==========================================
export const getLabById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const lab = await prisma.lab.findUnique({
    where: { id },
    include: {
      track: true,
      judge: { select: { id: true, name: true, title: true, username: true } },
      schedulledEvaluations: {
        include: {
          team: {
            select: {
              id: true,
              name: true,
              projectName: true,
              _count: { select: { students: true } },
            },
          },
        },
        orderBy: { sequenceNo: "asc" },
      },
    },
  });

  if (!lab) {
    return res.status(404).json({
      success: false,
      message: "Lab not found.",
    });
  }

  return res.status(200).json({
    success: true,
    data: sanitizeLab(lab),
  });
});

// ==========================================
// 4. UPDATE LAB
// ==========================================
export const updateLab = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { code, building, floor, trackId, judgeId } = req.body;

  const existingLab = await prisma.lab.findUnique({ where: { id } });
  if (!existingLab) {
    return res.status(404).json({
      success: false,
      message: "Lab not found.",
    });
  }

  // Validate Track update
  if (trackId) {
    const trackExists = await prisma.track.findUnique({
      where: { id: trackId },
    });
    if (!trackExists) {
      return res.status(404).json({
        success: false,
        message: "Track not found.",
      });
    }
  }

  // Validate 1-to-1 Judge constraint
  if (judgeId !== undefined && judgeId !== null) {
    const judgeExists = await prisma.judge.findUnique({
      where: { id: judgeId },
    });
    if (!judgeExists) {
      return res.status(404).json({
        success: false,
        message: "Judge not found.",
      });
    }

    const assignedLab = await prisma.lab.findUnique({ where: { judgeId } });
    if (assignedLab && assignedLab.id !== id) {
      return res.status(400).json({
        success: false,
        message: "This judge is already assigned to another lab.",
      });
    }
  }

  const updatedLab = await prisma.lab.update({
    where: { id },
    data: {
      ...(code && { code }),
      ...(building !== undefined && { building }),
      ...(floor !== undefined && { floor }),
      ...(trackId && { trackId }),
      ...(judgeId !== undefined && { judgeId }),
    },
    include: {
      track: { select: { id: true, name: true } },
      judge: { select: { id: true, name: true, title: true, username: true } },
    },
  });

  return res.status(200).json({
    success: true,
    message: "Lab updated successfully.",
    data: sanitizeLab(updatedLab),
  });
});

// ==========================================
// 5. DELETE LAB
// ==========================================
export const deleteLab = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const existingLab = await prisma.lab.findUnique({ where: { id } });
  if (!existingLab) {
    return res.status(404).json({
      success: false,
      message: "Lab not found.",
    });
  }

  await prisma.lab.delete({
    where: { id },
  });

  return res.status(200).json({
    success: true,
    message: "Lab deleted successfully.",
  });
});
