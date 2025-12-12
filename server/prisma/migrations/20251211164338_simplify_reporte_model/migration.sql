/*
  Warnings:

  - You are about to drop the column `fecha_fin` on the `Reporte` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_inicio` on the `Reporte` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id_clase,fecha]` on the table `Reporte` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fecha` to the `Reporte` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Reporte_id_clase_fecha_inicio_fecha_fin_key";

-- AlterTable
ALTER TABLE "Reporte" DROP COLUMN "fecha_fin",
DROP COLUMN "fecha_inicio",
ADD COLUMN     "fecha" DATE NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Reporte_id_clase_fecha_key" ON "Reporte"("id_clase", "fecha");
