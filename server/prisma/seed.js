import prisma from "../config/prisma.js";
import { seedMaterias } from "./seeds/materias.seed.js";
import { seedSecciones } from "./seeds/secciones.seed.js";

async function main() {
  try {
    await seedMaterias();
    await seedSecciones();
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
