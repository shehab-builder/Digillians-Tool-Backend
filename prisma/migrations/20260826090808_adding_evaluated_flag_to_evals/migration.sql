-- CreateEnum
CREATE TYPE "JudgeTitle" AS ENUM ('PROFESSOR', 'DR', 'ENGINEER', 'MR', 'MS');

-- CreateEnum
CREATE TYPE "EvaluationStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'LOCKED');

-- CreateEnum
CREATE TYPE "CriteriaType" AS ENUM ('PROJECT', 'STUDENT');

-- CreateTable
CREATE TABLE "Admins" (
    "id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "username" VARCHAR NOT NULL,
    "password_hash" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tracks" (
    "id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,

    CONSTRAINT "Tracks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Labs" (
    "id" UUID NOT NULL,
    "code" VARCHAR NOT NULL,
    "building" VARCHAR,
    "floor" VARCHAR,
    "track_id" UUID NOT NULL,
    "judge_id" UUID,

    CONSTRAINT "Labs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Judges" (
    "id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "title" "JudgeTitle",
    "username" VARCHAR NOT NULL,
    "password_hash" VARCHAR NOT NULL,

    CONSTRAINT "Judges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teams" (
    "id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "project_name" VARCHAR NOT NULL,
    "description" TEXT,
    "cover" VARCHAR,
    "track_id" UUID NOT NULL,

    CONSTRAINT "Teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Students" (
    "id" UUID NOT NULL,
    "team_id" UUID NOT NULL,
    "full_name" VARCHAR NOT NULL,
    "student_code" VARCHAR,

    CONSTRAINT "Students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchedulledEvaluation" (
    "id" UUID NOT NULL,
    "sequence_no" INTEGER NOT NULL,
    "team_id" UUID NOT NULL,
    "lab_id" UUID NOT NULL,
    "evaluated" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SchedulledEvaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Criteria" (
    "id" UUID NOT NULL,
    "track_id" UUID NOT NULL,
    "type" "CriteriaType" NOT NULL,
    "title" VARCHAR NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "max_score" INTEGER NOT NULL,

    CONSTRAINT "Criteria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Projects_Evaluation" (
    "id" UUID NOT NULL,
    "team_id" UUID NOT NULL,
    "judge_id" UUID NOT NULL,
    "status" "EvaluationStatus" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "submitted_at" TIMESTAMPTZ,

    CONSTRAINT "Projects_Evaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Projects_Evaluation_Item" (
    "id" UUID NOT NULL,
    "evaluation_id" UUID NOT NULL,
    "criteria_id" UUID NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "Projects_Evaluation_Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Students_Evaluation" (
    "id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "judge_id" UUID NOT NULL,
    "status" "EvaluationStatus" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "submitted_at" TIMESTAMPTZ,

    CONSTRAINT "Students_Evaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Students_Evaluation_Item" (
    "id" UUID NOT NULL,
    "evaluation_id" UUID NOT NULL,
    "criteria_id" UUID NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "Students_Evaluation_Item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admins_username_key" ON "Admins"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Labs_judge_id_key" ON "Labs"("judge_id");

-- CreateIndex
CREATE UNIQUE INDEX "Judges_username_key" ON "Judges"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Students_student_code_key" ON "Students"("student_code");

-- CreateIndex
CREATE UNIQUE INDEX "SchedulledEvaluation_team_id_key" ON "SchedulledEvaluation"("team_id");

-- CreateIndex
CREATE UNIQUE INDEX "Projects_Evaluation_team_id_key" ON "Projects_Evaluation"("team_id");

-- CreateIndex
CREATE UNIQUE INDEX "Students_Evaluation_student_id_key" ON "Students_Evaluation"("student_id");

-- AddForeignKey
ALTER TABLE "Labs" ADD CONSTRAINT "Labs_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "Tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Labs" ADD CONSTRAINT "Labs_judge_id_fkey" FOREIGN KEY ("judge_id") REFERENCES "Judges"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teams" ADD CONSTRAINT "Teams_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "Tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Students" ADD CONSTRAINT "Students_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchedulledEvaluation" ADD CONSTRAINT "SchedulledEvaluation_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchedulledEvaluation" ADD CONSTRAINT "SchedulledEvaluation_lab_id_fkey" FOREIGN KEY ("lab_id") REFERENCES "Labs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Criteria" ADD CONSTRAINT "Criteria_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "Tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Projects_Evaluation" ADD CONSTRAINT "Projects_Evaluation_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Projects_Evaluation" ADD CONSTRAINT "Projects_Evaluation_judge_id_fkey" FOREIGN KEY ("judge_id") REFERENCES "Judges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Projects_Evaluation_Item" ADD CONSTRAINT "Projects_Evaluation_Item_evaluation_id_fkey" FOREIGN KEY ("evaluation_id") REFERENCES "Projects_Evaluation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Projects_Evaluation_Item" ADD CONSTRAINT "Projects_Evaluation_Item_criteria_id_fkey" FOREIGN KEY ("criteria_id") REFERENCES "Criteria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Students_Evaluation" ADD CONSTRAINT "Students_Evaluation_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Students_Evaluation" ADD CONSTRAINT "Students_Evaluation_judge_id_fkey" FOREIGN KEY ("judge_id") REFERENCES "Judges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Students_Evaluation_Item" ADD CONSTRAINT "Students_Evaluation_Item_evaluation_id_fkey" FOREIGN KEY ("evaluation_id") REFERENCES "Students_Evaluation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Students_Evaluation_Item" ADD CONSTRAINT "Students_Evaluation_Item_criteria_id_fkey" FOREIGN KEY ("criteria_id") REFERENCES "Criteria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
