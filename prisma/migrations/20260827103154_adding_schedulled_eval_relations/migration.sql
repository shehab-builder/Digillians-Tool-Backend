/*
  Warnings:

  - You are about to drop the column `judge_id` on the `Students_Evaluation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[s_eval_id]` on the table `Projects_Evaluation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `s_eval_id` to the `Projects_Evaluation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `s_eval_id` to the `Students_Evaluation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Projects_Evaluation" DROP CONSTRAINT "Projects_Evaluation_judge_id_fkey";

-- DropForeignKey
ALTER TABLE "Students_Evaluation" DROP CONSTRAINT "Students_Evaluation_judge_id_fkey";

-- AlterTable
ALTER TABLE "Projects_Evaluation" ADD COLUMN     "s_eval_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Students_Evaluation" DROP COLUMN "judge_id",
ADD COLUMN     "s_eval_id" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Projects_Evaluation_s_eval_id_key" ON "Projects_Evaluation"("s_eval_id");

-- AddForeignKey
ALTER TABLE "Projects_Evaluation" ADD CONSTRAINT "Projects_Evaluation_s_eval_id_fkey" FOREIGN KEY ("s_eval_id") REFERENCES "SchedulledEvaluation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Students_Evaluation" ADD CONSTRAINT "Students_Evaluation_s_eval_id_fkey" FOREIGN KEY ("s_eval_id") REFERENCES "SchedulledEvaluation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
