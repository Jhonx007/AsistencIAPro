/*
  Warnings:

  - You are about to drop the column `id_seccion` on the `Reporte` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id_clase,fecha_inicio,fecha_fin]` on the table `Reporte` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_clase` to the `Reporte` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Reporte" DROP CONSTRAINT "Reporte_id_seccion_fkey";

-- AlterTable
ALTER TABLE "Reporte" DROP COLUMN "id_seccion",
ADD COLUMN     "id_clase" INTEGER NOT NULL,
ADD COLUMN     "titulo" TEXT,
ADD COLUMN     "total_ausentes" INTEGER,
ADD COLUMN     "total_estudiantes" INTEGER,
ADD COLUMN     "total_presentes" INTEGER,
ALTER COLUMN "fecha_inicio" SET DATA TYPE DATE,
ALTER COLUMN "fecha_fin" SET DATA TYPE DATE;

-- CreateIndex
CREATE UNIQUE INDEX "Reporte_id_clase_fecha_inicio_fecha_fin_key" ON "Reporte"("id_clase", "fecha_inicio", "fecha_fin");

-- AddForeignKey
ALTER TABLE "Reporte" ADD CONSTRAINT "Reporte_id_clase_fkey" FOREIGN KEY ("id_clase") REFERENCES "clases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
