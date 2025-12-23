import sys
import json
import os
import contextlib

# Suprimir logs de TensorFlow
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

try:
    from deepface import DeepFace
except ImportError:
    print(json.dumps({"success": False, "error": "Librería DeepFace no instalada"}))
    sys.exit(1)

def process_image(image_path):
    try:
        # DeepFace.represent devuelve una lista de objetos (uno por cara detectada)
        # model_name="VGG-Face" es el default, pero "Facenet" es muy bueno también.
        # enforce_detection=True lanza excepción si no hay cara.
        
        # Redirigir stdout/stderr temporalmente para que los logs de DeepFace no ensucien el JSON
        with open(os.devnull, "w") as f, contextlib.redirect_stdout(f), contextlib.redirect_stderr(f):
             embeddings = DeepFace.represent(
                img_path=image_path,
                model_name="VGG-Face",
                enforce_detection=True,
                detector_backend="opencv" # 'opencv' es rápido y fácil de instalar, 'retinaface' es mejor pero más pesado
            )

        if not embeddings or len(embeddings) == 0:
            return {"success": False, "error": "No se detectó ningún rostro"}

        # Tomamos el primer rostro detectado (el más prominente)
        first_face = embeddings[0]
        
        return {
            "success": True,
            "descriptor": first_face["embedding"],
            "box": first_face["facial_area"]
        }

    except ValueError as ve:
        return {"success": False, "error": "No se detectó ningún rostro en la imagen"}
    except Exception as e:
        return {"success": False, "error": str(e)}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"success": False, "error": "Ruta de imagen no proporcionada"}))
        sys.exit(1)

    image_path = sys.argv[1]
    
    if not os.path.exists(image_path):
        print(json.dumps({"success": False, "error": "El archivo de imagen no existe"}))
        sys.exit(1)

    result = process_image(image_path)
    print(json.dumps(result))
