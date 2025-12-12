import dayjs from "dayjs";
import "dayjs/locale/es";

dayjs.locale("es");

/**
 * Formatea una fecha al formato "12 de Dic, 2025"
 * @param date - Fecha en formato string (ISO, YYYY-MM-DD, etc.)
 * @returns Fecha formateada con mes capitalizado
 */
export function formatDate(date: string): string {
  const formatted = dayjs(date).format("D [de] MMM, YYYY");
  // Capitalizar la primera letra del mes
  return formatted.replace(
    /de (\w)/,
    (_, letter) => `de ${letter.toUpperCase()}`
  );
}
