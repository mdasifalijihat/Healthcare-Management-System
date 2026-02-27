/*
  Warnings:

  - You are about to alter the column `appointmentFee` on the `doctor` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `averageRating` on the `doctor` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(3,2)`.

*/
-- AlterEnum
ALTER TYPE "Gender" ADD VALUE 'OTHER';

-- DropIndex
DROP INDEX "idx_doctor_email";

-- AlterTable
ALTER TABLE "doctor" ALTER COLUMN "appointmentFee" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "averageRating" SET DATA TYPE DECIMAL(3,2);
