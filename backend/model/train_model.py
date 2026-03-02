# =====================================================
# TRAIN MODEL SCRIPT
# =====================================================

import pandas as pd
import os
import joblib
import scipy.sparse as sp

from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer


# =====================================================
# STEP 1: PATH SETUP (VERY IMPORTANT)
# =====================================================

# Current file location
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Project root folder
PROJECT_ROOT = os.path.abspath(
    os.path.join(BASE_DIR, "../../")
)

# Dataset path
DATASET_PATH = os.path.join(
    PROJECT_ROOT,
    "dataset",
    "IT_Career_Risk_Dataset.csv"
)

print("Dataset Path:", DATASET_PATH)


# =====================================================
# STEP 2: LOAD DATASET
# =====================================================

df = pd.read_csv(DATASET_PATH)

print("Dataset Loaded ✅")
print("Rows:", df.shape[0])


# =====================================================
# STEP 3: TEXT FEATURE (SKILLS)
# =====================================================

skills_text = df["primary_skills"].astype(str)

vectorizer = TfidfVectorizer()

X_skills = vectorizer.fit_transform(skills_text)


# =====================================================
# STEP 4: NUMERIC FEATURES
# =====================================================

numeric_features = df[
[
    "experience_score",
    "ai_impact_score",
    "automation_risk",
    "market_demand",
    "skill_adaptability"
]
]


# Combine features
X = sp.hstack([X_skills, numeric_features])


# Target
y = df["layoff_risk"]


# =====================================================
# STEP 5: TRAIN TEST SPLIT
# =====================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)


# =====================================================
# STEP 6: MODEL TRAINING
# =====================================================

model = RandomForestRegressor(
    n_estimators=200,
    random_state=42,
    n_jobs=-1
)

model.fit(X_train, y_train)

print("✅ Model Training Completed")


# =====================================================
# STEP 7: SAVE MODEL SAFELY
# =====================================================

model_path = os.path.join(BASE_DIR, "risk_model.pkl")
vectorizer_path = os.path.join(BASE_DIR, "vectorizer.pkl")

joblib.dump(model, model_path)
joblib.dump(vectorizer, vectorizer_path)

print("\n✅ Model saved at:", model_path)
print("✅ Vectorizer saved at:", vectorizer_path)


# =====================================================
# STEP 8: QUICK VALIDATION
# =====================================================

print("\nModel File Size:",
      os.path.getsize(model_path), "bytes")

print("Vectorizer File Size:",
      os.path.getsize(vectorizer_path), "bytes")

print("\n🎉 TRAINING SUCCESSFUL")