import dayjs from "dayjs";
import "dayjs/locale/es";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

dayjs.locale("es");

/**
 * Formatea una fecha al formato "12 de Dic, 2025"
 * @param date - Fecha en formato string (ISO, YYYY-MM-DD, etc.)
 * @returns Fecha formateada con mes capitalizado
 */
export function formatDate(date: string | Date): string {
  const formatted = dayjs.utc(date).format("D [de] MMM, YYYY");
  // Capitalizar la primera letra del mes
  return formatted.replace(
    /de (\w)/,
    (_, letter) => `de ${letter.toUpperCase()}`,
  );
}

/**
 * Formatea una fecha al formato "YYYY-MM-DD" para uso en APIs/URLs
 * @param date - Fecha en formato string o Date
 * @returns Fecha en formato YYYY-MM-DD
 */
export function formatDateForApi(date: string | Date): string {
  return dayjs.utc(date).format("YYYY-MM-DD");
}
