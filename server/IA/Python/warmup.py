from deepface import DeepFace
import os

# Suprimir logs
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

print("⏳ Descargando modelos de DeepFace (esto puede tardar unos minutos)...")
try:
    # Esto forzará la descarga de pesos de VGG-Face
    DeepFace.build_model("VGG-Face")
    print("✅ Modelos descargados y listos!")
except Exception as e:
    print(f"❌ Error durante warmup: {e}")
