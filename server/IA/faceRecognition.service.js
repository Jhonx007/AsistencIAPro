import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import os from "os";

// Configuración de rutas para módulos ES6 (__dirname y __filename)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class FaceRecognitionService {
  constructor() {
    // Ruta al script de Python que queremos ejecutar
    this.pythonScriptPath = path.join(__dirname, "Python", "process_face.py");

    // Determinar la ruta exacta del ejecutable de Python dentro del venv
    this.pythonExecutable = this.getPythonExecutablePath();

    console.log(`[IA Service] Python Executable: ${this.pythonExecutable}`);
  }

  /**
   * Determina la ruta del intérprete de Python dentro del venv
   * basado en el sistema operativo (Windows vs. Unix).
   * @returns {string} La ruta absoluta al ejecutable.
   */
  getPythonExecutablePath() {
    // La carpeta 'python' y 'venv' están al lado de este archivo JS
    const venvBase = path.join(__dirname, "Python", "venv");

    // Windows usa 'Scripts\python.exe'
    if (os.platform() === "win32") {
      return path.join(venvBase, "Scripts", "python.exe");
    }
    // Linux/macOS usa 'bin/python'
    else {
      return path.join(venvBase, "bin", "python");
    }
  }

  // Mantenemos la firma del método para no romper el resto del código
  async loadModels() {
    // Comprobación de que el ejecutable existe
    if (!fs.existsSync(this.pythonExecutable)) {
      console.error(
        `🔴 ERROR: El intérprete de Python no se encontró en: ${this.pythonExecutable}`
      );
      console.log(
        "🚨 SOLUCIÓN: Cree y active el venv e instale dependencias (pip install -r requirements.txt)."
      );
      // Lanzamos un error si la IA es crítica para el arranque
      // throw new Error("No se pudo iniciar el servicio de IA. Falta el entorno virtual.");
    }

    console.log(" Servicio de IA (Python) listo para usar.");
    return Promise.resolve();
  }

  /**
   * Detecta rostro y extrae descriptor usando el microservicio Python
   * @param {Buffer} imageBuffer - Buffer de la imagen
   * @returns {Promise<Object>} - { descriptor: number[], confidence: number }
   */
  async detectFaceAndDescriptor(imageBuffer) {
    return new Promise((resolve, reject) => {
      // 1. Crear archivo temporal para pasar la imagen a Python
      const tempFilePath = path.join(os.tmpdir(), `face_${Date.now()}.jpg`);

      try {
        fs.writeFileSync(tempFilePath, imageBuffer);
      } catch (error) {
        return reject(
          new Error(`Error al guardar imagen temporal: ${error.message}`)
        );
      }

      // 2. Ejecutar script de Python USANDO EL EJECUTABLE DEL VENV
      // Utilizamos 'this.pythonExecutable' en lugar de simplemente 'python'
      const pythonProcess = spawn(this.pythonExecutable, [
        this.pythonScriptPath,
        tempFilePath,
      ]);

      let dataString = "";
      let errorString = "";

      pythonProcess.stdout.on("data", (data) => {
        dataString += data.toString();
      });

      pythonProcess.stderr.on("data", (data) => {
        errorString += data.toString();
      });

      pythonProcess.on("close", (code) => {
        // 3. Limpiar archivo temporal
        try {
          if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
        } catch (e) {
          console.warn("No se pudo borrar archivo temporal:", e);
        }

        if (code !== 0) {
          // Si Python falla o devuelve un código de error
          return reject(
            new Error(
              `Error en reconocimiento facial (Exit code ${code}): ${
                errorString || "Error desconocido"
              }`
            )
          );
        }

        try {
          // 4. Procesar la respuesta JSON de Python
          const result = JSON.parse(dataString);

          if (!result.success) {
            return reject(
              new Error(
                result.error ||
                  "No se detectó rostro (Respuesta JSON de Python)"
              )
            );
          }

          resolve({
            descriptor: result.descriptor,
            confidence: 0.99,
            box: result.face_locations ? result.face_locations[0] : null,
          });
        } catch (error) {
          reject(
            new Error(
              `Error al procesar respuesta JSON de IA: ${error.message}. Output recibido: ${dataString}`
            )
          );
        }
      });

      // Manejo de errores de inicio (ej. el ejecutable no se encontró)
      pythonProcess.on("error", (err) => {
        reject(
          new Error(
            `Fallo al iniciar el proceso Python: ${err.message}. Revise la ruta: ${this.pythonExecutable}`
          )
        );
      });
    });
  }

  /**
   * Compara dos descriptores faciales (Distancia Euclidiana)
   */
  compareFaces(descriptor1, descriptor2) {
    if (!descriptor1 || !descriptor2) return 1.0; // Max distancia

    // Calcular distancia euclidiana
    const dist = Math.sqrt(
      descriptor1.reduce(
        (sum, val, i) => sum + Math.pow(val - descriptor2[i], 2),
        0
      )
    );
    return dist;
  }

  isMatch(descriptor1, descriptor2, threshold = 0.6) {
    // 0.6 es el umbral estándar para dlib/face_recognition
    return this.compareFaces(descriptor1, descriptor2) < threshold;
  }
}

export default new FaceRecognitionService();
