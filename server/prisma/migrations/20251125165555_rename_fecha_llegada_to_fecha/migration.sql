/*
  Warnings:

  - You are about to drop the column `fecha_llegada` on the `Asistencia` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id_matricula,fecha]` on the table `Asistencia` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Asistencia_id_matricula_fecha_llegada_key";

-- AlterTable
ALTER TABLE "Asistencia" DROP COLUMN "fecha_llegada",
ADD COLUMN     "fecha" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "Asistencia_id_matricula_fecha_key" ON "Asistencia"("id_matricula", "fecha");
