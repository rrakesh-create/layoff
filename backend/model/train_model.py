import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score
import joblib

# 1. Load the updated dataset
df = pd.read_csv(r'/Users/hemalathaguthurthi/Downloads/Final_Updated_Dataset.csv')

# 2. Categorical data ni handle cheddam (Label Encoding)
# Role mariyu Experience Level ni numbers ga marchali
le_role = LabelEncoder()
le_exp = LabelEncoder()

df['role_encoded'] = le_role.fit_transform(df['role'])
df['exp_level_encoded'] = le_exp.fit_transform(df['experience_level'])

# 3. Features Selection (Input columns)
X = df[['role_encoded', 'exp_level_encoded', 'years_experience', 
        'ai_impact_score', 'automation_risk', 'market_demand', 'skill_adaptability']]

# Target Variable (Output we want to predict)
y = df['layoff_risk']

# 4. Data Splitting (80% Training, 20% Testing)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 5. Model Training (Random Forest Regressor)
# Idi IT trends lanti non-linear data ki chala baga work avtundi
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# 6. Model Evaluation
y_pred = model.predict(X_test)
print(f"Model Accuracy (R2 Score): {r2_score(y_test, y_pred)*100:.2f}%")
print(f"Average Error: {mean_absolute_error(y_test, y_pred):.2f}%")

# 7. Model ni Save cheddam (App lo use cheyadaniki)
joblib.dump(model, 'layoff_model.pkl')
joblib.dump(le_role, 'role_encoder.pkl')
joblib.dump(le_exp, 'exp_encoder.pkl')

print("Model and Encoders saved successfully!")

# Model Test cheyadaniki (Example)
def predict_my_risk(role, exp_level, years, ai_score, auto_score, market_score, adapt_score):
    # Input ni encode cheyali
    role_encoded = le_role.transform([role])[0]
    exp_encoded = le_exp.transform([exp_level])[0]
    
    # Prediction
    features = [[role_encoded, exp_encoded, years, ai_score, auto_score, market_score, adapt_score]]
    risk = model.predict(features)
    
    print(f"\n--- Prediction Result ---")
    print(f"Role: {role} ({exp_level})")
    print(f"Predicted Layoff Risk: {risk[0]:.2f}%")

# Test it!
predict_my_risk('ML Engineer', 'senior', 8, 0.2, 0.2, 0.9, 0.9)
predict_my_risk('Frontend Developer', 'junior', 1, 0.8, 0.7, 0.5, 0.4)