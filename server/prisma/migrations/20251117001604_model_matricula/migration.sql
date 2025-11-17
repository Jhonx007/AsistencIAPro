-- CreateTable
CREATE TABLE "Matricula" (
    "id_estudiante" INTEGER NOT NULL,
    "id_seccion" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Matricula_pkey" PRIMARY KEY ("id_estudiante","id_seccion")
);

-- AddForeignKey
ALTER TABLE "Matricula" ADD CONSTRAINT "Matricula_id_estudiante_fkey" FOREIGN KEY ("id_estudiante") REFERENCES "Estudiante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Matricula" ADD CONSTRAINT "Matricula_id_seccion_fkey" FOREIGN KEY ("id_seccion") REFERENCES "Seccion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
