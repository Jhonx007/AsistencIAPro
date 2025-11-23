import prisma from "../config/prisma.js";

async function main() {
  try {
    const materiasCount = await prisma.materia.count();
    const seccionesCount = await prisma.seccion.count();

    console.log(`Materias encontradas: ${materiasCount}`);
    console.log(`Secciones encontradas: ${seccionesCount}`);

    if (materiasCount >= 15 && seccionesCount >= 8) {
      console.log("✅ Seeding verificado correctamente.");
    } else {
      console.log("❌ Faltan datos del seeding.");
    }

  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
