/*
  Warnings:

  - You are about to drop the column `fecha` on the `Asistencia` table. All the data in the column will be lost.
  - You are about to drop the column `id_estudiante` on the `Asistencia` table. All the data in the column will be lost.
  - You are about to drop the column `id_seccion` on the `Asistencia` table. All the data in the column will be lost.
  - The primary key for the `Matricula` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[id_matricula,id_materia,fecha_llegada]` on the table `Asistencia` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_estudiante,id_seccion]` on the table `Matricula` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fecha_llegada` to the `Asistencia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_materia` to the `Asistencia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_matricula` to the `Asistencia` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Asistencia" DROP CONSTRAINT "Asistencia_id_estudiante_id_seccion_fkey";

-- DropIndex
DROP INDEX "Asistencia_id_estudiante_id_seccion_fecha_key";

-- AlterTable
ALTER TABLE "Asistencia" DROP COLUMN "fecha",
DROP COLUMN "id_estudiante",
DROP COLUMN "id_seccion",
ADD COLUMN     "fecha_llegada" DATE NOT NULL,
ADD COLUMN     "id_materia" INTEGER NOT NULL,
ADD COLUMN     "id_matricula" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Matricula" DROP CONSTRAINT "Matricula_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Matricula_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Asistencia_id_matricula_id_materia_fecha_llegada_key" ON "Asistencia"("id_matricula", "id_materia", "fecha_llegada");

-- CreateIndex
CREATE UNIQUE INDEX "Matricula_id_estudiante_id_seccion_key" ON "Matricula"("id_estudiante", "id_seccion");

-- AddForeignKey
ALTER TABLE "Asistencia" ADD CONSTRAINT "Asistencia_id_matricula_fkey" FOREIGN KEY ("id_matricula") REFERENCES "Matricula"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asistencia" ADD CONSTRAINT "Asistencia_id_materia_fkey" FOREIGN KEY ("id_materia") REFERENCES "Materia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
