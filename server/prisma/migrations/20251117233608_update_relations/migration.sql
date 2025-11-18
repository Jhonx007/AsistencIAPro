-- DropForeignKey
ALTER TABLE "Asistencia" DROP CONSTRAINT "Asistencia_id_estudiante_fkey";

-- DropForeignKey
ALTER TABLE "Asistencia" DROP CONSTRAINT "Asistencia_id_seccion_fkey";

-- AddForeignKey
ALTER TABLE "Asistencia" ADD CONSTRAINT "Asistencia_id_estudiante_id_seccion_fkey" FOREIGN KEY ("id_estudiante", "id_seccion") REFERENCES "Matricula"("id_estudiante", "id_seccion") ON DELETE RESTRICT ON UPDATE CASCADE;
