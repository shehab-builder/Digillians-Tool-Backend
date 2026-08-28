import { prisma } from "../lib/db.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/appError.js";

// ==========================================
// 1. SUBMIT OR SAVE PROJECT EVALUATION (DRAFT / SUBMITTED)
// ==========================================
export const submitProjectEvaluation = catchAsync(async (req, res, next) => {
  const judgeId = req.user.id;
  const { teamId, status, items, sEvalId } = req.body; // items = [{ criteriaId, score }]
  console.log(req.body);

  if (!teamId || !Array.isArray(items) || items.length === 0) {
    return next(
      new AppError(
        "Please provide teamId and an array of evaluation items.",
        400,
      ),
    );
  }

  // 1. Verify Team exists & fetch track criteria
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    select: { id: true, trackId: true },
  });

  if (!team) {
    return next(new AppError("Team not found.", 404));
  }

  // 2. Fetch allowed PROJECT criteria for this track
  const trackCriteria = await prisma.criteria.findMany({
    where: { trackId: team.trackId, type: "PROJECT" },
  });

  const validCriteriaMap = new Map(trackCriteria.map((c) => [c.id, c]));

  // 3. Ensure ALL criteria items are submitted if status is "SUBMITTED"
  if (status === "SUBMITTED" && items.length !== trackCriteria.length) {
    return next(
      new AppError(
        `All ${trackCriteria.length} evaluation criteria must be rated to submit.`,
        400,
      ),
    );
  }

  // 4. Validate scores and criteria matching
  for (const item of items) {
    const matchedCriteria = validCriteriaMap.get(item.criteriaId);

    if (!matchedCriteria) {
      return next(
        new AppError(
          `Criteria ID ${item.criteriaId} does not belong to this team's track or is not a PROJECT type.`,
          400,
        ),
      );
    }

    if (item.score < 0 || item.score > matchedCriteria.maxScore) {
      return next(
        new AppError(
          `Score for '${matchedCriteria.title}' must be between 0 and ${matchedCriteria.maxScore}.`,
          400,
        ),
      );
    }
  }

  const evalStatus = status === "SUBMITTED" ? "SUBMITTED" : "DRAFT";

  // 5. Upsert Evaluation header & replace nested Items transactionally
  const evaluation = await prisma.$transaction(async (tx) => {
    const existing = await tx.projectsEvaluation.findUnique({
      where: { sEvalId: sEvalId },
    });
    const x = await tx.schedulledEvaluation.update({
      where: { id: sEvalId },
      data: { evaluated: true },
    });
    console.log(x);

    const submittedAt =
      evalStatus === "SUBMITTED"
        ? existing?.submittedAt || new Date()
        : existing?.submittedAt || null;

    if (existing) {
      return tx.projectsEvaluation.update({
        where: { id: existing.id },
        data: {
          sEvalId: sEvalId,
          status: evalStatus,
          submittedAt,
          version: { increment: 1 },
          items: {
            create: items.map((i) => ({
              criteriaId: i.criteriaId,
              score: i.score,
            })),
          },
        },
        include: { items: { include: { criteria: true } } },
      });
    }

    return tx.projectsEvaluation.create({
      data: {
        teamId,
        sEvalId: sEvalId,
        status: evalStatus,
        submittedAt: evalStatus === "SUBMITTED" ? new Date() : null,
        items: {
          create: items.map((i) => ({
            criteriaId: i.criteriaId,
            score: i.score,
          })),
        },
      },
      include: { items: { include: { criteria: true } } },
    });
  });

  return res.status(200).json({
    success: true,
    message: `Project evaluation ${evalStatus === "SUBMITTED" ? "submitted" : "saved as draft"} successfully.`,
    data: evaluation,
  });
});

// ==========================================
// 2. GET PROJECT EVALUATION BY TEAM ID
// ==========================================
export const getProjectEvaluationByTeam = catchAsync(async (req, res, next) => {
  const { teamId } = req.params;

  const evaluation = await prisma.projectsEvaluation.findUnique({
    where: { teamId },
    include: {
      team: { select: { id: true, name: true, projectName: true } },
      judge: { select: { id: true, name: true, title: true } },
      items: {
        include: {
          criteria: {
            select: { id: true, title: true, maxScore: true, weight: true },
          },
        },
      },
    },
  });

  if (!evaluation) {
    return next(
      new AppError("No project evaluation found for this team.", 404),
    );
  }

  return res.status(200).json({
    success: true,
    data: evaluation,
  });
});

// ==========================================
// 3. SUBMIT OR SAVE STUDENT EVALUATION (DRAFT / SUBMITTED)
// ==========================================
export const submitStudentEvaluationsBatch = catchAsync(
  async (req, res, next) => {
    const judgeId = req.user.id;
    const { status, evaluations, sEvalId } = req.body;

    if (!Array.isArray(evaluations) || evaluations.length === 0) {
      return next(
        new AppError("Please provide an array of evaluation items.", 400),
      );
    }

    const evalStatus = status === "SUBMITTED" ? "SUBMITTED" : "DRAFT";

    // 1. Group flat items by studentId
    const groupedMap = new Map();
    for (const item of evaluations) {
      if (!groupedMap.has(item.studentId)) {
        groupedMap.set(item.studentId, []);
      }
      groupedMap.get(item.studentId).push({
        criteriaId: item.criteriaId,
        score: Number(item.score),
      });
    }

    const normalizedEvaluations = Array.from(
      groupedMap.entries(),
      ([studentId, items]) => ({ studentId, items }),
    );

    const studentIds = normalizedEvaluations.map((e) => e.studentId);

    // 2. Fetch all students & verify existence
    const students = await prisma.student.findMany({
      where: { id: { in: studentIds } },
      include: { team: { select: { trackId: true } } },
    });

    const studentMap = new Map(students.map((s) => [s.id, s]));

    for (const sId of studentIds) {
      if (!studentMap.has(sId)) {
        return next(new AppError(`Student with ID ${sId} not found.`, 404));
      }
    }

    // 3. Extract shared trackId & fetch criteria
    const trackId = students[0].team.trackId;
    const trackCriteria = await prisma.criteria.findMany({
      where: { trackId, type: "STUDENT" },
    });

    const validCriteriaMap = new Map(trackCriteria.map((c) => [c.id, c]));

    // 4. Validate items against single track criteria
    for (const evalPayload of normalizedEvaluations) {
      const student = studentMap.get(evalPayload.studentId);

      if (
        evalStatus === "SUBMITTED" &&
        evalPayload.items.length !== trackCriteria.length
      ) {
        return next(
          new AppError(
            `All ${trackCriteria.length} STUDENT criteria must be evaluated for student ${
              student.fullName || student.id
            }.`,
            400,
          ),
        );
      }

      for (const item of evalPayload.items) {
        const criteria = validCriteriaMap.get(item.criteriaId);
        if (!criteria) {
          return next(
            new AppError(
              `Criteria ID ${item.criteriaId} is invalid or not a STUDENT criteria for this track.`,
              400,
            ),
          );
        }

        if (item.score < 0 || item.score > criteria.maxScore) {
          return next(
            new AppError(
              `Score for '${criteria.title}' must be between 0 and ${criteria.maxScore}.`,
              400,
            ),
          );
        }
      }
    }

    // 5. Atomic database transaction
    const results = await prisma.$transaction(async (tx) => {
      const upsertedRecords = [];

      for (const evalPayload of normalizedEvaluations) {
        const { studentId, items } = evalPayload;

        const existing = await tx.studentsEvaluation.findUnique({
          where: { studentId },
        });

        const submittedAt =
          evalStatus === "SUBMITTED"
            ? existing?.submittedAt || new Date()
            : existing?.submittedAt || null;

        if (existing) {
          await tx.studentsEvaluationItem.deleteMany({
            where: { evaluationId: existing.id },
          });

          const updated = await tx.studentsEvaluation.update({
            where: { id: existing.id },
            data: {
              sEvalId: sEvalId,
              status: evalStatus,
              submittedAt,
              version: { increment: 1 },
              items: {
                create: items.map((i) => ({
                  criteriaId: i.criteriaId,
                  score: i.score,
                })),
              },
            },
            include: { items: { include: { criteria: true } } },
          });
          upsertedRecords.push(updated);
        } else {
          const created = await tx.studentsEvaluation.create({
            data: {
              studentId,
              sEvalId: sEvalId,
              status: evalStatus,
              submittedAt: evalStatus === "SUBMITTED" ? new Date() : null,
              items: {
                create: items.map((i) => ({
                  criteriaId: i.criteriaId,
                  score: i.score,
                })),
              },
            },
            include: { items: { include: { criteria: true } } },
          });
          upsertedRecords.push(created);
        }
      }

      return upsertedRecords;
    });

    return res.status(200).json({
      success: true,
      message: `Evaluations for ${results.length} students ${
        evalStatus === "SUBMITTED" ? "submitted" : "saved as draft"
      } successfully.`,
      count: results.length,
      data: results,
    });
  },
);
// ==========================================
// 4. GET STUDENT EVALUATION BY STUDENT ID
// ==========================================
export const getStudentEvaluationByStudent = catchAsync(
  async (req, res, next) => {
    const { studentId } = req.params;

    const evaluation = await prisma.studentsEvaluation.findUnique({
      where: { studentId },
      include: {
        student: { select: { id: true, fullName: true, studentCode: true } },
        judge: { select: { id: true, name: true, title: true } },
        items: {
          include: {
            criteria: {
              select: { id: true, title: true, maxScore: true, weight: true },
            },
          },
        },
      },
    });

    if (!evaluation) {
      return next(new AppError("No evaluation found for this student.", 404));
    }

    return res.status(200).json({
      success: true,
      data: evaluation,
    });
  },
);

export const getEvaluations = catchAsync(async (req, res, next) => {
  const sEvalId = req.params.sEvalId;
  const projectEvaluation = await prisma.projectsEvaluation.findUnique({
    where: { sEvalId: sEvalId },
    include: {
      items: true,
    },
  });
  console.log(projectEvaluation);

  const studentsEvaluation = await prisma.studentsEvaluation.findMany({
    where: { sEvalId: sEvalId },
    include: {
      items: true,
    },
  });

  return res.status(200).json({
    data: {
      studentsEvaluation,
      projectEvaluation,
    },
  });
});
// ==========================================
// GET ALL EVALUATIONS BY TRACK ID
// ==========================================
export const getAllEvaluationsByTrack = catchAsync(async (req, res, next) => {
  const { trackId } = req.params;

  // 1. Verify Track exists
  const track = await prisma.track.findUnique({
    where: { id: trackId },
    select: { id: true, name: true },
  });

  if (!track) {
    return next(new AppError("Track not found.", 404));
  }

  // 2. Fetch all scheduled evaluations belonging to teams in this track
  const scheduledEvaluations = await prisma.schedulledEvaluation.findMany({
    where: {
      team: { trackId: trackId },
    },
    include: {
      team: {
        select: {
          id: true,
          name: true,
          projectName: true,
          students: {
            select: { id: true, fullName: true, studentCode: true },
          },
        },
      },
      lab: {
        select: {
          id: true,
          code: true,
          building: true,
          floor: true,
          judge: true,
        },
      },
      projectEvaluation: {
        include: {
          items: {
            include: {
              criteria: {
                select: { id: true, title: true, maxScore: true, weight: true },
              },
            },
          },
        },
      },
      studentsEvaluations: {
        include: {
          student: {
            select: { id: true, fullName: true, studentCode: true },
          },
          items: {
            include: {
              criteria: {
                select: { id: true, title: true, maxScore: true, weight: true },
              },
            },
          },
        },
      },
    },
    orderBy: { sequenceNo: "asc" },
  });

  // 3. Format the response for each team in the track
  const evaluationsData = scheduledEvaluations.map((sEval) => {
    const studentEvalMap = new Map(
      sEval.studentsEvaluations.map((se) => [se.studentId, se]),
    );

    const students = sEval.team.students.map((student) => {
      const evaluation = studentEvalMap.get(student.id);
      return {
        student,
        status: evaluation?.status || "NOT_STARTED",
        evaluation: evaluation || null,
      };
    });

    return {
      sEvalId: sEval.id,
      sequenceNo: sEval.sequenceNo,
      evaluated: sEval.evaluated,
      lab: sEval.lab,
      team: {
        id: sEval.team.id,
        name: sEval.team.name,
        projectName: sEval.team.projectName,
      },
      projectEvaluation: sEval.projectEvaluation || null,
      studentsEvaluations: students,
    };
  });

  return res.status(200).json({
    success: true,
    count: evaluationsData.length,
    track: track,
    data: evaluationsData,
  });
});
