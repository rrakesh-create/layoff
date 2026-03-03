from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import re
from model.predict import predict_risk 

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class RiskInput(BaseModel):
    role: str
    skills: str
    years_experience: float

@app.post("/predict")
def predict(data: RiskInput):
    try:
        # 1. Normalize Role Name
        raw_role = data.role
        normalized_role = re.sub(r"([a-z])([A-Z])", r"\1 \2", raw_role).strip()
        
        # 2. MARKET-DRIVEN ROLE BOUNDARIES & ROLE-SPECIFIC EXPLANATIONS
        role_rules = {
            'Cybersecurity Analyst': {
                'min': 5, 'max': 30, 'ai': 0.15, 'demand': 0.98, 
                'market_reason': 'Cybersecurity is a high-demand human-centric role. Even with AI, human intuition is mandatory for security.'
            },
            'ML Engineer': {
                'min': 8, 'max': 35, 'ai': 0.20, 'demand': 0.95,
                'market_reason': 'Core role driving the AI revolution; high demand for building and maintaining AI models.'
            },
            'Cloud Engineer': {
                'min': 15, 'max': 45, 'ai': 0.35, 'demand': 0.88,
                'market_reason': 'Cloud infrastructure is essential; however, automated provisioning (IaC) slightly impacts manual tasks.'
            },
            'DevOps Engineer': {
                'min': 12, 'max': 40, 'ai': 0.35, 'demand': 0.88,
                'market_reason': 'Critical for CICD, but AI is starting to automate standard deployment scripts.'
            },
            'Full Stack Developer': {
                'min': 40, 'max': 80, 'ai': 0.60, 'demand': 0.75,
                'market_reason': 'Versatility helps, but generic development is increasingly being handled by AI co-pilots.'
            },
            'App Developer': {
                'min': 35, 'max': 75, 'ai': 0.60, 'demand': 0.70,
                'market_reason': 'Mobile dev is stable, but low-code platforms are reducing the need for basic app builders.'
            },
            'Data Analyst': {
                'min': 50, 'max': 85, 'ai': 0.80, 'demand': 0.65,
                'market_reason': 'High risk as GenAI can now perform complex data cleaning, visualization, and basic insights.'
            },
            'Backend Developer': {
                'min': 60, 'max': 95, 'ai': 0.85, 'demand': 0.60,
                'market_reason': 'High risk due to AI ability to generate complex server-side logic and database schemas instantly.'
            },
            'Blockchain Developer': {
                'min': 65, 'max': 98, 'ai': 0.70, 'demand': 0.40,
                'market_reason': 'Market volatility and high specialization make this role highly unstable during downturns.'
            },
            'Frontend Developer': {
                'min': 70, 'max': 98, 'ai': 0.95, 'demand': 0.50,
                'market_reason': 'Very high risk; AI can now convert UI designs (Figma/Images) directly into high-quality code.'
            }
        }

        rule = role_rules.get(normalized_role, {'min': 30, 'max': 70, 'ai': 0.5, 'demand': 0.6, 'market_reason': 'Standard industry competition.'})

        # 3. Dynamic Explanation Builder
        reasons = []
        reasons.append(f"Role Impact: {rule['market_reason']}")

        # 4. Adjustment Logic & Skill Explanations
        user_skills = data.skills.lower()
        modern = ['react', 'nextjs', 'aws', 'docker', 'kubernetes', 'genai', 'cyberark', 'sentinel', 'pytorch', 'typescript']
        legacy = ['jquery', 'manual testing', 'php 5', 'html only', 'css only']

        adjustment = 0
        if any(k in user_skills for k in modern):
            adjustment -= 12
            reasons.append("Skill Advantage: Your knowledge of modern/trending tech significantly buffers you against layoffs.")
        if any(k in user_skills for k in legacy):
            penalty = 5 if normalized_role == 'Cybersecurity Analyst' else 15
            adjustment += penalty
            reasons.append("Skill Warning: Dependence on legacy or outdated tools increases vulnerability to AI automation.")

        if data.years_experience > 8:
            adjustment -= 10
            reasons.append("Experience Factor: Seniority provides architectural depth that AI cannot easily replicate.")
        elif data.years_experience <= 2:
            adjustment += 15
            reasons.append("Experience Factor: Entry-level roles are currently the most vulnerable to market shifts and budget cuts.")

        # 5. Final Score and Risk Level for UI Meter
        base_ai_risk = predict_risk(role=normalized_role, experience_level="mid", years_experience=data.years_experience, ai_impact_score=rule['ai'], automation_risk=rule['ai'], market_demand=rule['demand'], skill_adaptability=0.8)
        
        final_risk = max(rule['min'], min(base_ai_risk + adjustment, rule['max']))
        
        # Risk Category for UI Coloring
        risk_level = "Low" if final_risk <= 35 else "Moderate" if final_risk <= 65 else "High"

        return {
            "status": "success",
            "role": normalized_role,
            "layoff_risk": round(final_risk, 2),
            "risk_level": risk_level,
            "explanations": reasons,  # List of reasons for UI
            "meter_config": {
                "min": rule['min'],
                "max": rule['max'],
                "color": "green" if risk_level == "Low" else "orange" if risk_level == "Moderate" else "red"
            }
        }

    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")