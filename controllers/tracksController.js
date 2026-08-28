import { prisma } from "../lib/db.js";
import { catchAsync } from "../utils/catchAsync.js";

// 1. CREATE TRACK
export const createTrack = catchAsync(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      success: false,
      message: "Please enter track name.",
    });
  }

  const track = await prisma.track.create({
    data: { name },
  });

  return res.status(201).json({
    success: true,
    message: "Track created successfully.",
    data: track,
  });
});

// 2. GET ALL TRACKS
export const getAllTracks = catchAsync(async (req, res) => {
  const tracks = await prisma.track.findMany({
    include: {
      _count: {
        select: { labs: true, teams: true, criteria: true },
      },
      criteria: true,
    },
    orderBy: { name: "asc" },
  });

  return res.status(200).json({
    success: true,
    count: tracks.length,
    data: tracks,
  });
});

// 3. GET TRACK BY ID
export const getTrackById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const track = await prisma.track.findUnique({
    where: { id },
    include: {
      labs: {
        include: {
          judge: { select: { id: true, name: true, title: true } },
        },
      },
      criteria: true,
      teams: {
        include: { _count: { select: { students: true } } },
      },
    },
  });

  if (!track) {
    return res.status(404).json({
      success: false,
      message: "Track not found.",
    });
  }

  return res.status(200).json({
    success: true,
    data: track,
  });
});

// 4. UPDATE TRACK
export const updateTrack = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      success: false,
      message: "Please provide a track name to update.",
    });
  }

  // Check if track exists
  const existingTrack = await prisma.track.findUnique({ where: { id } });
  if (!existingTrack) {
    return res.status(404).json({
      success: false,
      message: "Track not found.",
    });
  }

  const updatedTrack = await prisma.track.update({
    where: { id },
    data: { name },
  });

  return res.status(200).json({
    success: true,
    message: "Track updated successfully.",
    data: updatedTrack,
  });
});

// 5. DELETE TRACK
export const deleteTrack = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Check if track exists
  const existingTrack = await prisma.track.findUnique({ where: { id } });
  if (!existingTrack) {
    return res.status(404).json({
      success: false,
      message: "Track not found.",
    });
  }

  await prisma.track.delete({
    where: { id },
  });

  return res.status(200).json({
    success: true,
    message: "Track deleted successfully.",
  });
});
