from pydantic import BaseModel


class PredictionRequest(BaseModel):
    skills: str
    role: str
    experience_level: str
    years_experience: int