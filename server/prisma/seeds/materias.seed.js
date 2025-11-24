import prisma from "../../config/prisma.js";

export const seedMaterias = async () => {
  const materias = [
    "Matemática I",
    "Matemática II",
    "Matemática III",
    "Matemática IV",
    "Física I",
    "Física II",
    "Programación I",
    "Programación II",
    "Base de Datos",
    "Ingeniería de Software",
    "Redes de Computadoras",
    "Sistemas Operativos",
    "Estadística",
    "Inglés I",
    "Inglés II"
  ];

  console.log("🌱 Sembrando Materias...");

  for (const nombre of materias) {
    await prisma.materia.upsert({
      where: { nombre },
      update: {},
      create: { nombre },
    });
  }

  console.log("✅ Materias sembradas.");
};
