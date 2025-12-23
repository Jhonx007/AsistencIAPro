/*
  Warnings:

  - You are about to drop the column `face_descriptor` on the `Asistencia` table. All the data in the column will be lost.
  - You are about to drop the column `foto_url` on the `Asistencia` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Asistencia" DROP COLUMN "face_descriptor",
DROP COLUMN "foto_url";

-- AlterTable
ALTER TABLE "Estudiante" ADD COLUMN     "face_descriptor" JSONB,
ADD COLUMN     "foto_url" TEXT;
