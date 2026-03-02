from fastapi import FastAPI
from schemas import PredictionRequest
from model.predict import predict_risk
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Layoff Risk AI Running"}


@app.post("/predict")
def predict(data: PredictionRequest):

    risk = predict_risk(data)

    if risk < 30:
        level = "Low"
    elif risk < 60:
        level = "Medium"
    else:
        level = "High"

    return {
        "layoff_risk": risk,
        "risk_level": level
    }