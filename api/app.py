"""
Suraksha Drishti - Backend API
Flask server for AI model inference
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import tensorflow as tf
import base64
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for browser requests

# Load models
print("Loading AI models...")

# Find model helper
def find_model(filename):
    paths = [
        filename,
        os.path.join('..', '..', 'complete new', 'models', filename),
        os.path.join('..', '..', 'new models', filename),
        os.path.join('models', filename)
    ]
    for path in paths:
        if os.path.exists(path):
            return path
    return None

# Load models
try:
    # CNN Model
    cnn_path = find_model('mobilenet_feature_extractor.tflite')
    if cnn_path:
        cnn_model = tf.lite.Interpreter(model_path=cnn_path)
        cnn_model.allocate_tensors()
        print("✅ CNN model loaded")
    else:
        cnn_model = None
        print("❌ CNN model not found")
    
    # LSTM Model
    lstm_path = find_model('violence_detection_lstm.h5')
    if lstm_path:
        lstm_model = tf.keras.models.load_model(lstm_path, compile=False)
        print("✅ LSTM model loaded")
    else:
        lstm_model = None
        print("❌ LSTM model not found")
    
    # Gender Model
    gender_path = find_model('gender_classification.tflite')
    if gender_path:
        gender_model = tf.lite.Interpreter(model_path=gender_path)
        gender_model.allocate_tensors()
        print("✅ Gender model loaded")
    else:
        gender_model = None
        print("❌ Gender model not found")
    
    # YOLO Model
    try:
        from ultralytics import YOLO
        yolo_path = find_model('yolov8n.pt')
        if yolo_path:
            yolo_model = YOLO(yolo_path, verbose=False)
            print("✅ YOLO model loaded")
        else:
            yolo_model = YOLO('yolov8n.pt', verbose=False)
            print("✅ YOLO model downloaded")
    except:
        yolo_model = None
        print("❌ YOLO model failed")
    
    # Face Cascade
    face_cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
    )
    print("✅ Face detection loaded")
    
except Exception as e:
    print(f"❌ Error loading models: {e}")

# Sequence buffer for LSTM
SEQ_LENGTH = 30
sequence_buffer = np.zeros((1, SEQ_LENGTH, 1280), dtype=np.float32)

# Dangerous objects
DANGEROUS_CLASSES = {
    'knife': 'Knife',
    'scissors': 'Scissors',
    'fork': 'Sharp Object',
    'bottle': 'Bottle',
    'baseball bat': 'Bat',
    'sports ball': 'Projectile'
}

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'models': {
            'cnn': cnn_model is not None,
            'lstm': lstm_model is not None,
            'gender': gender_model is not None,
            'yolo': yolo_model is not None,
            'face': face_cascade is not None
        }
    })

@app.route('/api/detect', methods=['POST'])
def detect():
    """Main detection endpoint"""
    try:
        # Get image from request
        data = request.json
        image_data = data.get('image', '')
        
        # Decode base64 image
        image_bytes = base64.b64decode(image_data.split(',')[1])
        nparr = np.frombuffer(image_bytes, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if frame is None:
            return jsonify({'error': 'Invalid image'}), 400
        
        results = {
            'threatLevel': 0,
            'violence': False,
            'weapons': [],
            'people': 0,
            'male': 0,
            'female': 0,
            'detections': []
        }
        
        # Violence Detection
        if cnn_model and lstm_model:
            try:
                # Extract features with CNN
                input_frame = cv2.resize(frame, (128, 128))
                input_frame = cv2.cvtColor(input_frame, cv2.COLOR_BGR2RGB)
                input_frame = np.expand_dims(input_frame, axis=0).astype(np.float32)
                input_frame = (input_frame / 127.5) - 1.0
                
                cnn_input = cnn_model.get_input_details()
                cnn_output = cnn_model.get_output_details()
                
                cnn_model.set_tensor(cnn_input[0]['index'], input_frame)
                cnn_model.invoke()
                feature_vector = cnn_model.get_tensor(cnn_output[0]['index'])
                
                # Update sequence buffer
                global sequence_buffer
                sequence_buffer = np.roll(sequence_buffer, shift=-1, axis=1)
                sequence_buffer[0, -1, :] = feature_vector[0, :]
                
                # LSTM prediction
                lstm_pred = lstm_model.predict(sequence_buffer, verbose=0)[0, 0]
                results['threatLevel'] = float(lstm_pred * 100)
                results['violence'] = lstm_pred > 0.7
            except Exception as e:
                print(f"Violence detection error: {e}")
        
        # Weapon Detection
        if yolo_model:
            try:
                yolo_results = yolo_model(frame, verbose=False, conf=0.4)
                for result in yolo_results:
                    for box in result.boxes:
                        cls = int(box.cls[0])
                        conf = float(box.conf[0])
                        class_name = result.names[cls].lower()
                        
                        if class_name in DANGEROUS_CLASSES:
                            x1, y1, x2, y2 = map(int, box.xyxy[0])
                            weapon_name = DANGEROUS_CLASSES[class_name]
                            results['weapons'].append({
                                'name': weapon_name,
                                'confidence': conf,
                                'box': [x1, y1, x2, y2]
                            })
                            results['threatLevel'] = max(results['threatLevel'], 85)
            except Exception as e:
                print(f"Weapon detection error: {e}")
        
        # Gender Detection
        if gender_model and face_cascade:
            try:
                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                faces = face_cascade.detectMultiScale(gray, 1.3, 5, minSize=(50, 50))
                
                male_count = 0
                female_count = 0
                
                for (x, y, w, h) in faces:
                    try:
                        face = frame[y:y+h, x:x+w]
                        face_resized = cv2.resize(face, (128, 128))
                        face_rgb = cv2.cvtColor(face_resized, cv2.COLOR_BGR2RGB)
                        face_normalized = np.expand_dims(face_rgb / 255.0, axis=0).astype(np.float32)
                        
                        gender_input = gender_model.get_input_details()
                        gender_output = gender_model.get_output_details()
                        
                        gender_model.set_tensor(gender_input[0]['index'], face_normalized)
                        gender_model.invoke()
                        gender_pred = gender_model.get_tensor(gender_output[0]['index'])[0, 0]
                        
                        if gender_pred > 0.5:
                            female_count += 1
                            gender = 'Female'
                        else:
                            male_count += 1
                            gender = 'Male'
                        
                        results['detections'].append({
                            'type': 'person',
                            'gender': gender,
                            'confidence': float(gender_pred if gender_pred > 0.5 else 1 - gender_pred),
                            'box': [x, y, w, h]
                        })
                    except:
                        continue
                
                results['people'] = len(faces)
                results['male'] = male_count
                results['female'] = female_count
            except Exception as e:
                print(f"Gender detection error: {e}")
        
        return jsonify(results)
    
    except Exception as e:
        print(f"Detection error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/')
def index():
    return jsonify({
        'name': 'Suraksha Drishti API',
        'version': '1.0',
        'status': 'running'
    })

if __name__ == '__main__':
    print("\n" + "="*60)
    print("🛡️ SURAKSHA DRISHTI API SERVER")
    print("="*60)
    print("Server starting on http://localhost:5000")
    print("API endpoint: http://localhost:5000/api/detect")
    print("Health check: http://localhost:5000/api/health")
    print("="*60 + "\n")
    
    app.run(host='0.0.0.0', port=5000, debug=True)
