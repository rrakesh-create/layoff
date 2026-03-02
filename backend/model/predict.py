import joblib
import os
import scipy.sparse as sp


# ===============================
# LOAD MODEL
# ===============================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

model = joblib.load(
    os.path.join(BASE_DIR, "risk_model.pkl")
)

vectorizer = joblib.load(
    os.path.join(BASE_DIR, "vectorizer.pkl")
)


# ===============================
# EXPERIENCE MAP
# ===============================

exp_map = {
    "junior": 1,
    "mid": 2,
    "senior": 3
}


# ===============================
# ROLE FEATURE MAPS
# ===============================

ai_impact = {
"Frontend Developer":0.7,
"Backend Developer":0.5,
"Full Stack Developer":0.4,
"Data Analyst":0.6,
"ML Engineer":0.2,
"DevOps Engineer":0.2,
"Cloud Engineer":0.2,
"Cybersecurity Engineer":0.1,
"App Developer":0.5,
"Blockchain Developer":0.6
}

automation = {
"Frontend Developer":0.75,
"Backend Developer":0.55,
"Full Stack Developer":0.45,
"Data Analyst":0.65,
"ML Engineer":0.25,
"DevOps Engineer":0.2,
"Cloud Engineer":0.2,
"Cybersecurity Engineer":0.1,
"App Developer":0.5,
"Blockchain Developer":0.6
}

demand = {
"ML Engineer":0.9,
"Cybersecurity Engineer":0.95,
"Cloud Engineer":0.9,
"DevOps Engineer":0.85,
"Backend Developer":0.75,
"Full Stack Developer":0.8,
"Frontend Developer":0.65,
"App Developer":0.7,
"Data Analyst":0.8,
"Blockchain Developer":0.6
}

adaptability = {
"Full Stack Developer":0.9,
"Backend Developer":0.8,
"Frontend Developer":0.7,
"ML Engineer":0.75,
"DevOps Engineer":0.85,
"Cloud Engineer":0.85,
"Cybersecurity Engineer":0.7,
"App Developer":0.65,
"Data Analyst":0.75,
"Blockchain Developer":0.6
}


# ===============================
# PREDICT FUNCTION
# ===============================

def predict_risk(data):

    skills_vec = vectorizer.transform([data.skills])

    experience_score = exp_map[data.experience_level.lower()]

    numeric_features = [[
        experience_score,
        ai_impact[data.role],
        automation[data.role],
        demand[data.role],
        adaptability[data.role]
    ]]

    X = sp.hstack([skills_vec, numeric_features])

    risk = model.predict(X)[0]

    return round(float(risk), 2)