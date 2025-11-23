import prisma from "../../config/prisma.js";

export const seedSecciones = async () => {
  const secciones = ["D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8"];
  const semestre = "2025-1"; // Semestre por defecto

  console.log("🌱 Sembrando Secciones...");

  for (const codigo of secciones) {
    await prisma.seccion.upsert({
      where: { codigo },
      update: {},
      create: {
        codigo,
        semestre
      },
    });
  }

  console.log("✅ Secciones sembradas.");
};
