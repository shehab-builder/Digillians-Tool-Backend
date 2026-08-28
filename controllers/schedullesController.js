import { prisma } from "../lib/db.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/appError.js";

// ==========================================
// 1. SCHEDULE A TEAM IN A LAB
// ==========================================
export const scheduleTeam = catchAsync(async (req, res, next) => {
  const { teamId, labId, sequenceNo } = req.body;

  if (!teamId || !labId) {
    return next(new AppError("Please provide teamId and labId.", 400));
  }

  // 1. Check if team exists
  const team = await prisma.team.findUnique({ where: { id: teamId } });
  if (!team) {
    return next(new AppError("Team not found.", 404));
  }

  // 2. Check if lab exists
  const lab = await prisma.lab.findUnique({ where: { id: labId } });
  if (!lab) {
    return next(new AppError("Lab not found.", 404));
  }

  // 3. Check if team is already scheduled anywhere (teamId is @unique)
  const existingSchedule = await prisma.schedulledEvaluation.findUnique({
    where: { teamId },
  });
  if (existingSchedule) {
    return next(
      new AppError("This team is already scheduled for an evaluation.", 400),
    );
  }

  // 4. Auto-calculate sequence number if not provided
  let targetSequence = sequenceNo;
  if (targetSequence === undefined || targetSequence === null) {
    const lastScheduled = await prisma.schedulledEvaluation.findFirst({
      where: { labId },
      orderBy: { sequenceNo: "desc" },
    });
    targetSequence = lastScheduled ? lastScheduled.sequenceNo + 1 : 1;
  }

  // 5. Create schedule entry
  const schedule = await prisma.schedulledEvaluation.create({
    data: {
      teamId,
      labId,
      sequenceNo: Number(targetSequence),
    },
    include: {
      team: { select: { id: true, name: true, projectName: true } },
      lab: { select: { id: true, code: true, building: true, floor: true } },
    },
  });

  return res.status(201).json({
    success: true,
    message: "Team scheduled successfully.",
    data: schedule,
  });
});

// ==========================================
// 2. GET ALL SCHEDULED EVALUATIONS (WITH OPTIONAL LAB FILTER)
// ==========================================
export const getAllScheduledEvaluations = catchAsync(async (req, res) => {
  const { labId } = req.query;

  const where = labId ? { labId } : {};

  const schedules = await prisma.schedulledEvaluation.findMany({
    where,
    include: {
      team: {
        select: {
          id: true,
          name: true,
          projectName: true,
          track: { select: { id: true, name: true } },
          _count: { select: { students: true } },
        },
      },
      lab: {
        select: {
          id: true,
          code: true,
          building: true,
          floor: true,
          judge: { select: { id: true, name: true, title: true } },
        },
      },
    },
    orderBy: [{ labId: "asc" }, { sequenceNo: "asc" }],
  });

  return res.status(200).json({
    success: true,
    count: schedules.length,
    data: schedules,
  });
});

// ==========================================
// 3. GET SCHEDULE BY LAB ID
// ==========================================
export const getScheduleByLab = catchAsync(async (req, res, next) => {
  const { labId } = req.params;

  const labExists = await prisma.lab.findUnique({ where: { id: labId } });
  if (!labExists) {
    return next(new AppError("Lab not found.", 404));
  }

  const labSchedule = await prisma.schedulledEvaluation.findMany({
    where: { labId },
    include: {
      team: {
        include: {
          students: { select: { id: true, fullName: true, studentCode: true } },
          projectsEvaluation: { select: { id: true, status: true } },
        },
      },
    },
    orderBy: { sequenceNo: "asc" },
  });

  return res.status(200).json({
    success: true,
    count: labSchedule.length,
    data: labSchedule,
  });
});

// ==========================================
// 4. UPDATE A SCHEDULED EVALUATION (CHANGE LAB / SEQUENCE)
// ==========================================
export const updateScheduledEvaluation = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { labId, sequenceNo } = req.body;

  const existingSchedule = await prisma.schedulledEvaluation.findUnique({
    where: { id },
  });
  if (!existingSchedule) {
    return next(new AppError("Scheduled evaluation entry not found.", 404));
  }

  if (labId) {
    const labExists = await prisma.lab.findUnique({ where: { id: labId } });
    if (!labExists) {
      return next(new AppError("Lab not found.", 404));
    }
  }

  const updatedSchedule = await prisma.schedulledEvaluation.update({
    where: { id },
    data: {
      ...(labId && { labId }),
      ...(sequenceNo !== undefined && { sequenceNo: Number(sequenceNo) }),
    },
    include: {
      team: { select: { id: true, name: true, projectName: true } },
      lab: { select: { id: true, code: true, building: true, floor: true } },
    },
  });

  return res.status(200).json({
    success: true,
    message: "Schedule updated successfully.",
    data: updatedSchedule,
  });
});

// ==========================================
// 5. BULK REORDER LAB SCHEDULE SEQUENCE
// ==========================================
export const reorderLabSchedule = catchAsync(async (req, res, next) => {
  const { labId } = req.params;
  const { items } = req.body; // Expects array of { id, sequenceNo }

  if (!Array.isArray(items) || items.length === 0) {
    return next(
      new AppError(
        "Please provide an array of items with id and sequenceNo.",
        400,
      ),
    );
  }

  const updatePromises = items.map((item) =>
    prisma.schedulledEvaluation.update({
      where: { id: item.id },
      data: { sequenceNo: Number(item.sequenceNo) },
    }),
  );

  await prisma.$transaction(updatePromises);

  const reorderedSchedule = await prisma.schedulledEvaluation.findMany({
    where: { labId },
    include: {
      team: { select: { id: true, name: true, projectName: true } },
    },
    orderBy: { sequenceNo: "asc" },
  });

  return res.status(200).json({
    success: true,
    message: "Lab evaluation queue reordered successfully.",
    data: reorderedSchedule,
  });
});

// ==========================================
// 6. DELETE SCHEDULED EVALUATION
// ==========================================
export const deleteScheduledEvaluation = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const existingSchedule = await prisma.schedulledEvaluation.findUnique({
    where: { id },
  });
  if (!existingSchedule) {
    return next(new AppError("Scheduled evaluation entry not found.", 404));
  }

  await prisma.schedulledEvaluation.delete({ where: { id } });

  return res.status(200).json({
    success: true,
    message: "Schedule entry removed successfully.",
  });
});
