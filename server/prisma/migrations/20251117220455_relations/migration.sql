-- AddForeignKey
ALTER TABLE "Seccion" ADD CONSTRAINT "Seccion_id_materia_fkey" FOREIGN KEY ("id_materia") REFERENCES "Materia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asistencia" ADD CONSTRAINT "Asistencia_id_estudiante_fkey" FOREIGN KEY ("id_estudiante") REFERENCES "Estudiante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asistencia" ADD CONSTRAINT "Asistencia_id_seccion_fkey" FOREIGN KEY ("id_seccion") REFERENCES "Seccion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profesor_Seccion" ADD CONSTRAINT "Profesor_Seccion_id_profesor_fkey" FOREIGN KEY ("id_profesor") REFERENCES "Profesor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profesor_Seccion" ADD CONSTRAINT "Profesor_Seccion_id_seccion_fkey" FOREIGN KEY ("id_seccion") REFERENCES "Seccion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
