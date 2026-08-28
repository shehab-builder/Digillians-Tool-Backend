import { prisma } from "../lib/db.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/appError.js";

// ==========================================
// 1. CREATE TEAM (WITH OPTIONAL STUDENTS)
// ==========================================
export const createTeam = catchAsync(async (req, res, next) => {
  const { name, projectName, description, cover, trackId, students } = req.body;
  console.log("Teams Request Body:", req.body);

  if (!name || !projectName || !trackId) {
    return next(
      new AppError("Please provide name, projectName, and trackId.", 400),
    );
  }

  // 1. Verify Track exists
  const trackExists = await prisma.track.findUnique({ where: { id: trackId } });
  if (!trackExists) {
    return next(
      new AppError("Track not found with the provided trackId.", 404),
    );
  }

  // 2. Validate Student Codes uniqueness if students are provided
  if (Array.isArray(students) && students.length > 0) {
    const studentCodes = students
      .map((s) => s.studentCode)
      .filter((code) => Boolean(code));

    if (studentCodes.length > 0) {
      const existingStudents = await prisma.student.findMany({
        where: { studentCode: { in: studentCodes } },
        select: { studentCode: true },
      });

      if (existingStudents.length > 0) {
        const takenCodes = existingStudents
          .map((s) => s.studentCode)
          .join(", ");
        return next(
          new AppError(
            `The following student code(s) are already registered: ${takenCodes}`,
            400,
          ),
        );
      }
    }
  }

  // 3. Create Team with nested Students
  const team = await prisma.team.create({
    data: {
      name,
      projectName,
      description: description || null,
      cover: cover || null,
      trackId,
      students:
        Array.isArray(students) && students.length > 0
          ? {
              create: students.map((s) => ({
                fullName: s.fullName,
                studentCode: s.studentCode || null,
              })),
            }
          : undefined,
    },
    include: {
      track: { select: { id: true, name: true } },
      students: { select: { id: true, fullName: true, studentCode: true } },
    },
  });

  return res.status(201).json({
    success: true,
    message: "Team created successfully.",
    data: team,
  });
});

// ==========================================
// 2. GET ALL TEAMS (WITH OPTIONAL TRACK FILTER)
// ==========================================
import { APIFeatures } from "../utils/apiFeatures.js";

export const getAllTeams = catchAsync(async (req, res, next) => {
  console.log(req.query);

  const features = new APIFeatures(req.query)
    .filter()
    .select()
    .sort()
    .paginate();

  // Apply default relations if no custom field selection is specified
  if (!features.prismaOptions.select) {
    features.prismaOptions.include = {
      track: { select: { id: true, name: true } },
      students: { select: { id: true, fullName: true, studentCode: true } },
      schedulledEvaluation: {
        include: {
          lab: {
            select: { id: true, code: true, building: true, floor: true },
          },
        },
      },
      _count: { select: { students: true } },
    };
  }

  // Set default sorting if none provided
  if (!features.prismaOptions.orderBy) {
    features.prismaOptions.orderBy = { name: "asc" };
  }

  // Execute query and count total matching records in parallel
  const [teams, totalCount] = await Promise.all([
    prisma.team.findMany(features.prismaOptions),
    prisma.team.count({ where: features.prismaOptions.where }),
  ]);

  const { page, limit } = features.paginationMeta;

  return res.status(200).json({
    success: true,
    count: teams.length,
    pagination: {
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    },
    data: teams,
  });
});

export const getAllTeamsNamesOnly = catchAsync(async (req, res, next) => {
  console.log(req.query);

  const features = new APIFeatures(req.query).filter();

  // Apply default relations if no custom field selection is specified
  if (!features.prismaOptions.select) {
    features.prismaOptions.select = {
      projectName: true,
      id: true,
    };
  }

  // Set default sorting if none provided
  if (!features.prismaOptions.orderBy) {
    features.prismaOptions.orderBy = { name: "asc" };
  }

  // Execute query and count total matching records in parallel
  const [teams, totalCount] = await Promise.all([
    prisma.team.findMany(features.prismaOptions),
    prisma.team.count({ where: features.prismaOptions.where }),
  ]);

  return res.status(200).json({
    success: true,
    count: teams.length,
    data: teams,
  });
});
// ==========================================
// 3. GET SINGLE TEAM BY ID
// ==========================================
export const getTeamById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const team = await prisma.team.findUnique({
    where: { id },
    include: {
      track: true,
      students: {
        include: {
          studentsEvaluation: {
            select: { id: true, status: true, submittedAt: true },
          },
        },
      },
      schedulledEvaluation: {
        include: {
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
      },
      projectsEvaluation: {
        select: { id: true, status: true, submittedAt: true },
      },
    },
  });

  if (!team) {
    return next(new AppError("Team not found.", 404));
  }

  return res.status(200).json({
    success: true,
    data: team,
  });
});

// ==========================================
// 4. UPDATE TEAM
// ==========================================
export const updateTeam = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name, projectName, description, cover, trackId } = req.body;

  const existingTeam = await prisma.team.findUnique({ where: { id } });
  if (!existingTeam) {
    return next(new AppError("Team not found.", 404));
  }

  if (trackId) {
    const trackExists = await prisma.track.findUnique({
      where: { id: trackId },
    });
    if (!trackExists) {
      return next(new AppError("Track not found.", 404));
    }
  }

  const updatedTeam = await prisma.team.update({
    where: { id },
    data: {
      ...(name && { name }),
      ...(projectName && { projectName }),
      ...(description !== undefined && { description }),
      ...(cover !== undefined && { cover }),
      ...(trackId && { trackId }),
    },
    include: {
      track: { select: { id: true, name: true } },
      students: { select: { id: true, fullName: true, studentCode: true } },
    },
  });

  return res.status(200).json({
    success: true,
    message: "Team updated successfully.",
    data: updatedTeam,
  });
});

// ==========================================
// 5. DELETE TEAM
// ==========================================
export const deleteTeam = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const existingTeam = await prisma.team.findUnique({ where: { id } });
  if (!existingTeam) {
    return next(new AppError("Team not found.", 404));
  }

  // Cascading deletes in Prisma schema will automatically remove associated students
  await prisma.team.delete({ where: { id } });

  return res.status(200).json({
    success: true,
    message: "Team deleted successfully.",
  });
});

// ==========================================
// 6. ADD STUDENT TO EXISTING TEAM
// ==========================================
export const addStudentToTeam = catchAsync(async (req, res, next) => {
  const { teamId } = req.params;
  const { fullName, studentCode } = req.body;

  if (!fullName) {
    return next(new AppError("Please provide student's full name.", 400));
  }

  const teamExists = await prisma.team.findUnique({ where: { id: teamId } });
  if (!teamExists) {
    return next(new AppError("Team not found.", 404));
  }

  if (studentCode) {
    const codeTaken = await prisma.student.findUnique({
      where: { studentCode },
    });
    if (codeTaken) {
      return next(new AppError("This student code is already in use.", 400));
    }
  }

  const newStudent = await prisma.student.create({
    data: {
      fullName,
      studentCode: studentCode || null,
      teamId,
    },
  });

  return res.status(201).json({
    success: true,
    message: "Student added to team successfully.",
    data: newStudent,
  });
});

// ==========================================
// 7. REMOVE STUDENT FROM TEAM
// ==========================================
export const removeStudent = catchAsync(async (req, res, next) => {
  const { studentId } = req.params;

  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student) {
    return next(new AppError("Student not found.", 404));
  }

  await prisma.student.delete({ where: { id: studentId } });

  return res.status(200).json({
    success: true,
    message: "Student removed successfully.",
  });
});
