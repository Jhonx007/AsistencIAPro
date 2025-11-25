/*
  Warnings:

  - You are about to drop the column `id_seccion` on the `Matricula` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id_estudiante,id_clase]` on the table `Matricula` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_clase` to the `Matricula` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Matricula" DROP CONSTRAINT "Matricula_id_seccion_fkey";

-- DropIndex
DROP INDEX "Matricula_id_estudiante_id_seccion_key";

-- AlterTable
ALTER TABLE "Matricula" DROP COLUMN "id_seccion",
ADD COLUMN     "id_clase" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Matricula_id_estudiante_id_clase_key" ON "Matricula"("id_estudiante", "id_clase");

-- AddForeignKey
ALTER TABLE "Matricula" ADD CONSTRAINT "Matricula_id_clase_fkey" FOREIGN KEY ("id_clase") REFERENCES "clases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
