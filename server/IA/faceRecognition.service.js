import * as faceapi from 'face-api.js';
import canvas from 'canvas';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class FaceRecognitionService {
  constructor() {
    this.modelsLoaded = false;
    this.initializeCanvas();
  }

  /**
   * Inicializa canvas para Node.js
   */
  initializeCanvas() {
    const { Canvas, Image, ImageData } = canvas;
    faceapi.env.monkeyPatch({ Canvas, Image, ImageData });
  }

  /**
   * Carga los modelos pre-entrenados de face-api.js
   * Solo se ejecuta una vez
   */
  async loadModels() {
    if (this.modelsLoaded) {
      console.log('✅ Modelos ya cargados previamente');
      return;
    }

    try {
      const modelsPath = path.join(__dirname, '../models');
      console.log('📦 Cargando modelos desde:', modelsPath);

      // Cargar los tres modelos necesarios
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromDisk(modelsPath),      // Detección de rostros
        faceapi.nets.faceLandmark68Net.loadFromDisk(modelsPath),   // Puntos faciales (68 puntos)
        faceapi.nets.faceRecognitionNet.loadFromDisk(modelsPath)   // Descriptores faciales
      ]);

      this.modelsLoaded = true;
      console.log('✅ Modelos cargados exitosamente');
      console.log('   - SSD MobileNet V1 (detección de rostros)');
      console.log('   - Face Landmark 68 Net (puntos faciales)');
      console.log('   - Face Recognition Net (descriptores)');
    } catch (error) {
      console.error('❌ Error al cargar modelos:', error);
      throw new Error('No se pudieron cargar los modelos de face-api.js');
    }
  }

  /**
   * Detecta un rostro en una imagen y extrae su descriptor facial
   * @param {Buffer} imageBuffer - Buffer de la imagen
   * @returns {Promise<Object>} - Objeto con detección, landmarks y descriptor
   */
  async detectFaceAndDescriptor(imageBuffer) {
    // Asegurar que los modelos estén cargados
    if (!this.modelsLoaded) {
      await this.loadModels();
    }

    try {
      // Convertir buffer a imagen de canvas
      const img = await canvas.loadImage(imageBuffer);

      // Detectar rostro + landmarks + descriptor
      const detection = await faceapi
        .detectSingleFace(img)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        throw new Error('No se detectó ningún rostro en la imagen');
      }

      return {
        detection: detection.detection,
        landmarks: detection.landmarks,
        descriptor: Array.from(detection.descriptor), // Convertir Float32Array a Array para JSON
        confidence: detection.detection.score
      };
    } catch (error) {
      console.error('❌ Error al detectar rostro:', error);
      throw error;
    }
  }

  /**
   * Compara dos descriptores faciales y retorna la distancia euclidiana
   * @param {Array<number>} descriptor1 - Primer descriptor (128 números)
   * @param {Array<number>} descriptor2 - Segundo descriptor (128 números)
   * @returns {number} - Distancia euclidiana (0-1, menor es más similar)
   */
  compareFaces(descriptor1, descriptor2) {
    // Convertir arrays a Float32Array si es necesario
    const desc1 = new Float32Array(descriptor1);
    const desc2 = new Float32Array(descriptor2);

    // Calcular distancia euclidiana
    const distance = faceapi.euclideanDistance(desc1, desc2);

    return distance;
  }

  /**
   * Encuentra el mejor match entre un descriptor y una lista de descriptores etiquetados
   * @param {Array<number>} queryDescriptor - Descriptor a comparar
   * @param {Array<Object>} labeledDescriptors - Array de {label, descriptors}
   * @returns {Object} - {label, distance, match}
   */
  findBestMatch(queryDescriptor, labeledDescriptors) {
    // Crear LabeledFaceDescriptors para face-api.js
    const labeled = labeledDescriptors.map(item =>
      new faceapi.LabeledFaceDescriptors(
        item.label,
        item.descriptors.map(d => new Float32Array(d))
      )
    );

    // Crear FaceMatcher con umbral de 0.6 (default)
    const faceMatcher = new faceapi.FaceMatcher(labeled, 0.6);

    // Encontrar mejor match
    const bestMatch = faceMatcher.findBestMatch(new Float32Array(queryDescriptor));

    return {
      label: bestMatch.label,
      distance: bestMatch.distance,
      match: bestMatch.label !== 'unknown' // true si encontró match
    };
  }

  /**
   * Verifica si los modelos están cargados
   * @returns {boolean}
   */
  areModelsLoaded() {
    return this.modelsLoaded;
  }
}

// Exportar instancia única (singleton)
export default new FaceRecognitionService();
