-- CreateTable
CREATE TABLE "Profesor_Seccion" (
    "id_profesor" UUID NOT NULL,
    "id_seccion" INTEGER NOT NULL,

    CONSTRAINT "Profesor_Seccion_pkey" PRIMARY KEY ("id_profesor","id_seccion")
);

-- CreateTable
CREATE TABLE "Reporte" (
    "id" SERIAL NOT NULL,
    "id_seccion" INTEGER NOT NULL,
    "fecha_inicio" TIMESTAMP(3) NOT NULL,
    "fecha_fin" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reporte_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Reporte" ADD CONSTRAINT "Reporte_id_seccion_fkey" FOREIGN KEY ("id_seccion") REFERENCES "Seccion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
