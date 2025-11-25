/*
  Warnings:

  - You are about to drop the column `id_materia` on the `Asistencia` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id_matricula,fecha_llegada]` on the table `Asistencia` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Asistencia" DROP CONSTRAINT "Asistencia_id_materia_fkey";

-- DropIndex
DROP INDEX "Asistencia_id_matricula_id_materia_fecha_llegada_key";

-- AlterTable
ALTER TABLE "Asistencia" DROP COLUMN "id_materia";

-- CreateIndex
CREATE UNIQUE INDEX "Asistencia_id_matricula_fecha_llegada_key" ON "Asistencia"("id_matricula", "fecha_llegada");
