import joblib
import numpy as np
import os

# Model files ekkada unnayo path set chestunnam
# 'backend/model_training.py' run chesinappudu ee files generate ayyi untayi
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'layoff_model.pkl')
ROLE_ENCODER_PATH = os.path.join(BASE_DIR, 'role_encoder.pkl')
EXP_ENCODER_PATH = os.path.join(BASE_DIR, 'exp_encoder.pkl')

# Global variables ga model and encoders ni load chestunnam
try:
    model = joblib.load(MODEL_PATH)
    le_role = joblib.load(ROLE_ENCODER_PATH)
    le_exp = joblib.load(EXP_ENCODER_PATH)
except Exception as e:
    print(f"Error loading model files: {e}")

def predict_risk(role: str, experience_level: str, years_experience: float, 
                 ai_impact_score: float, automation_risk: float, 
                 market_demand: float, skill_adaptability: float):
    """
    Kotha data ki layoff risk predict chestundi.
    """
    try:
        # 1. User icchina Role/Experience ni numbers ga marchali (Encoding)
        role_encoded = le_role.transform([role])[0]
        exp_encoded = le_exp.transform([experience_level.lower()])[0]

        # 2. Features list create cheyali
        features = np.array([[
            role_encoded, 
            exp_encoded, 
            years_experience, 
            ai_impact_score, 
            automation_risk, 
            market_demand, 
            skill_adaptability
        ]])

        # 3. Model tho prediction
        prediction = model.predict(features)
        
        # Risk percentage ni return chestunnam
        return float(round(prediction[0], 2))

    except Exception as e:
        print(f"Prediction Error: {e}")
        return None