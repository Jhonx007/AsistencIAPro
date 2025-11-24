/*
  Warnings:

  - You are about to drop the column `id_materia` on the `Seccion` table. All the data in the column will be lost.
  - You are about to drop the `Profesor_Seccion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Profesor_Seccion" DROP CONSTRAINT "Profesor_Seccion_id_profesor_fkey";

-- DropForeignKey
ALTER TABLE "Profesor_Seccion" DROP CONSTRAINT "Profesor_Seccion_id_seccion_fkey";

-- DropForeignKey
ALTER TABLE "Seccion" DROP CONSTRAINT "Seccion_id_materia_fkey";

-- AlterTable
ALTER TABLE "Seccion" DROP COLUMN "id_materia";

-- DropTable
DROP TABLE "Profesor_Seccion";

-- CreateTable
CREATE TABLE "clases" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "materia_id" INTEGER NOT NULL,
    "profesor_id" UUID NOT NULL,
    "seccion_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clases_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clases_profesor_id_materia_id_seccion_id_key" ON "clases"("profesor_id", "materia_id", "seccion_id");

-- AddForeignKey
ALTER TABLE "clases" ADD CONSTRAINT "clases_materia_id_fkey" FOREIGN KEY ("materia_id") REFERENCES "Materia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clases" ADD CONSTRAINT "clases_profesor_id_fkey" FOREIGN KEY ("profesor_id") REFERENCES "Profesor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clases" ADD CONSTRAINT "clases_seccion_id_fkey" FOREIGN KEY ("seccion_id") REFERENCES "Seccion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
