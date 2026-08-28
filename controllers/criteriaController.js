import { prisma } from "../lib/db.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/appError.js";

// ==========================================
// 1. CREATE CRITERIA FOR A TRACK
// ==========================================
export const createCriteria = catchAsync(async (req, res, next) => {
  const { title, type, maxScore, weight } = req.body;
  const { id } = req.params;
  const trackId = id;
  if (
    !title ||
    !type ||
    maxScore === undefined ||
    weight === undefined ||
    !trackId
  ) {
    return next(
      new AppError(
        "Please provide title, type (PROJECT or STUDENT), maxScore, weight, and trackId.",
        400,
      ),
    );
  }

  // 1. Validate CriteriaType Enum
  if (!["PROJECT", "STUDENT"].includes(type)) {
    return next(
      new AppError(
        "Invalid criteria type. Must be either 'PROJECT' or 'STUDENT'.",
        400,
      ),
    );
  }

  // 2. Check if track exists
  const track = await prisma.track.findUnique({
    where: { id: trackId },
    include: { criteria: true },
  });

  if (!track) {
    return next(
      new AppError("Track not found with the provided trackId.", 404),
    );
  }

  // 3. Validate total weight for the SAME criteria type <= 100%
  const currentTotalWeight = track.criteria
    .filter((c) => c.type === type)
    .reduce((acc, c) => acc + Number(c.weight), 0);

  if (currentTotalWeight + Number(weight) > 100) {
    return next(
      new AppError(
        `Adding this weight (${weight}%) exceeds 100% for ${type} criteria. Current total weight is ${currentTotalWeight}%.`,
        400,
      ),
    );
  }

  // 4. Create criteria
  const newCriteria = await prisma.criteria.create({
    data: {
      title,
      type,
      maxScore: Number(maxScore),
      weight: Number(weight),
      trackId,
    },
  });

  return res.status(201).json({
    success: true,
    message: "Criteria created successfully.",
    data: newCriteria,
  });
});

// ==========================================
// 2. GET ALL CRITERIA FOR A SPECIFIC TRACK
// ==========================================
export const getCriteriaByTrack = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { type } = req.query; // Optional filter: ?type=PROJECT or ?type=STUDENT
  console.log("A&A");

  const trackExists = await prisma.track.findUnique({ where: { id: id } });
  if (!trackExists) {
    return next(new AppError("Track not found.", 404));
  }

  const criteria = await prisma.criteria.findMany({
    where: {
      trackId: id,
    },
    orderBy: { title: "asc" },
  });

  const projectWeight = criteria
    .filter((c) => c.type === "PROJECT")
    .reduce((acc, c) => acc + Number(c.weight), 0);

  const studentWeight = criteria
    .filter((c) => c.type === "STUDENT")
    .reduce((acc, c) => acc + Number(c.weight), 0);

  return res.status(200).json({
    success: true,
    count: criteria.length,
    summary: {
      projectTotalWeight: projectWeight,
      studentTotalWeight: studentWeight,
    },
    data: criteria,
  });
});

// ==========================================
// 3. GET SINGLE CRITERIA BY ID
// ==========================================
export const getCriteriaById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const item = await prisma.criteria.findUnique({
    where: { id },
    include: {
      track: { select: { id: true, name: true } },
    },
  });

  if (!item) {
    return next(new AppError("Criteria not found.", 404));
  }

  return res.status(200).json({
    success: true,
    data: item,
  });
});

// ==========================================
// 4. UPDATE CRITERIA
// ==========================================
export const updateCriteria = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { title, type, maxScore, weight } = req.body;

  const existingCriteria = await prisma.criteria.findUnique({ where: { id } });
  if (!existingCriteria) {
    return next(new AppError("Criteria not found.", 404));
  }

  const targetType = type || existingCriteria.type;

  // Validate weight sum if weight or type is updated
  if (weight !== undefined || type !== undefined) {
    const otherCriteria = await prisma.criteria.findMany({
      where: {
        trackId: existingCriteria.trackId,
        type: targetType,
        NOT: { id },
      },
    });

    const otherWeightSum = otherCriteria.reduce(
      (acc, c) => acc + Number(c.weight),
      0,
    );

    const newWeight =
      weight !== undefined ? Number(weight) : Number(existingCriteria.weight);

    if (otherWeightSum + newWeight > 100) {
      return next(
        new AppError(
          `Updating this weight (${newWeight}%) exceeds 100% for ${targetType} criteria. Total weight would be ${
            otherWeightSum + newWeight
          }%.`,
          400,
        ),
      );
    }
  }

  const updatedCriteria = await prisma.criteria.update({
    where: { id },
    data: {
      ...(title && { title }),
      ...(type && { type }),
      ...(maxScore !== undefined && { maxScore: Number(maxScore) }),
      ...(weight !== undefined && { weight: Number(weight) }),
    },
  });

  return res.status(200).json({
    success: true,
    message: "Criteria updated successfully.",
    data: updatedCriteria,
  });
});

// ==========================================
// 5. DELETE CRITERIA
// ==========================================
export const deleteCriteria = catchAsync(async (req, res, next) => {
  const { criteriaId } = req.params;
  const id = criteriaId;
  console.log("Criteria Id: ", id);

  const existingCriteria = await prisma.criteria.findUnique({ where: { id } });
  if (!existingCriteria) {
    return next(new AppError("Criteria not found.", 404));
  }

  await prisma.criteria.delete({ where: { id } });

  return res.status(200).json({
    success: true,
    message: "Criteria deleted successfully.",
  });
});
