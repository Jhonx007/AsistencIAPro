-- CreateTable
CREATE TABLE "Asistencia" (
    "id" SERIAL NOT NULL,
    "id_estudiante" INTEGER NOT NULL,
    "id_seccion" INTEGER NOT NULL,
    "fecha" DATE NOT NULL,
    "es_presente" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Asistencia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Asistencia_id_estudiante_id_seccion_fecha_key" ON "Asistencia"("id_estudiante", "id_seccion", "fecha");
