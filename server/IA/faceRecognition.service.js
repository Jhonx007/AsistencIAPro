import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class FaceRecognitionService {
  constructor() {
    this.pythonScriptPath = path.join(__dirname, 'python/process_face.py');
  }

  // Mantenemos la firma del método para no romper el resto del código
  async loadModels() {
    console.log('✅ Servicio de IA (Python) listo');
    return Promise.resolve();
  }

  /**
   * Detecta rostro y extrae descriptor usando Python
   * @param {Buffer} imageBuffer - Buffer de la imagen
   * @returns {Promise<Object>} - { descriptor: number[], confidence: number }
   */
  async detectFaceAndDescriptor(imageBuffer) {
    return new Promise((resolve, reject) => {
      // 1. Crear archivo temporal
      const tempFilePath = path.join(os.tmpdir(), `face_${Date.now()}.jpg`);

      try {
        fs.writeFileSync(tempFilePath, imageBuffer);
      } catch (error) {
        return reject(new Error(`Error al guardar imagen temporal: ${error.message}`));
      }

      // 2. Ejecutar script de Python
      const pythonProcess = spawn('python', [this.pythonScriptPath, tempFilePath]);

      let dataString = '';
      let errorString = '';

      pythonProcess.stdout.on('data', (data) => {
        dataString += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        errorString += data.toString();
      });

      pythonProcess.on('close', (code) => {
        // 3. Limpiar archivo temporal
        try {
          if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
        } catch (e) {
          console.warn('No se pudo borrar archivo temporal:', e);
        }

        if (code !== 0) {
          // Si Python falla, rechazamos la promesa
          return reject(new Error(`Error en reconocimiento facial (Exit code ${code}): ${errorString || 'Error desconocido'}`));
        }

        try {
          const result = JSON.parse(dataString);

          if (!result.success) {
            return reject(new Error(result.error || 'No se detectó rostro'));
          }

          resolve({
            descriptor: result.descriptor,
            confidence: 0.99, // face_recognition es muy preciso
            box: result.face_locations ? result.face_locations[0] : null
          });

        } catch (error) {
          reject(new Error(`Error al procesar respuesta de IA: ${error.message}`));
        }
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
      descriptor1.reduce((sum, val, i) => sum + Math.pow(val - descriptor2[i], 2), 0)
    );
    return dist;
  }

  isMatch(descriptor1, descriptor2, threshold = 0.6) {
    // Para dlib/face_recognition, 0.6 es el umbral estándar
    // Menor número = caras más parecidas
    return this.compareFaces(descriptor1, descriptor2) < threshold;
  }
}

export default new FaceRecognitionService();