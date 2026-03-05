from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import re
import fitz  # PyMuPDF
from model.predict import predict_risk 
from typing import List, Optional

import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
genai_api_key = os.getenv("GEMINI_API_KEY")
if genai_api_key:
    genai.configure(api_key=genai_api_key)

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
    proficiency: Optional[dict] = None

class ChatRequest(BaseModel):
    message: str
    risk_level: str
    role: str
    skills: str

class RoadmapRequest(BaseModel):
    role: str
    skills: str
    years_experience: float
    risk_level: str

@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        doc = fitz.open(stream=contents, filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text()
        
        # 1. Detect Role
        detected_role = "Software Engineer"
        roles = [
            "Frontend Developer", "Backend Developer", "Full Stack Developer", 
            "ML Engineer", "Cloud Engineer", "DevOps Engineer", 
            "Data Analyst", "Cybersecurity Analyst"
        ]
        
        for r in roles:
            if re.search(r.replace(" ", r"\s*"), text, re.IGNORECASE):
                detected_role = r
                break
        
        # 2. Detect Experience
        exp_match = re.search(r"(\d+)\+?\s*(years|yrs|experience)", text, re.IGNORECASE)
        detected_exp = float(exp_match.group(1)) if exp_match else 2.0
        
        # 3. Detect Skills
        potential_skills = [
            "React", "Node.js", "Python", "AWS", "Docker", "Kubernetes", 
            "Java", "SQL", "MongoDB", "TypeScript", "JavaScript", 
            "Generative AI", "Machine Learning", "Cybersecurity"
        ]
        found_skills = [s for s in potential_skills if re.search(r"\b" + re.escape(s) + r"\b", text, re.IGNORECASE)]
        
        # 4. Default Proficiencies for extracted skills
        proficiency = {s: "Intermediate" for s in found_skills}
        
        return {
            "status": "success",
            "extracted_data": {
                "role": detected_role,
                "years_experience": detected_exp,
                "skills": ", ".join(found_skills),
                "proficiency": proficiency
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Resume parsing error: {str(e)}")

@app.post("/predict")
def predict(data: RiskInput):
    try:
        # 1. NORMALIZATION
        raw_role = data.role.strip()
        no_space_role = raw_role.replace(" ", "").lower()
        
        # 2. MARKET-DRIVEN ROLE BOUNDARIES (Automation Risks)
        role_rules = {
            'Cybersecurity Analyst': {
                'min': 5, 'max': 25, 'ai': 0.10, 'demand': 0.98, 
                'market_reason': 'High demand for human intuition in security; low automation risk.'
            },
            'ML Engineer': {
                'min': 5, 'max': 30, 'ai': 0.15, 'demand': 0.95,
                'market_reason': 'Core AI role; highly resistant to automation as they build the automation.'
            },
            'Cloud Engineer': {
                'min': 10, 'max': 35, 'ai': 0.25, 'demand': 0.90,
                'market_reason': 'Essential infrastructure, though basic tasks are being automated.'
            },
            'DevOps Engineer': {
                'min': 10, 'max': 40, 'ai': 0.30, 'demand': 0.88,
                'market_reason': 'Critical for delivery pipeline; high complexity reduces automation risk.'
            },
            'Full Stack Developer': {
                'min': 25, 'max': 60, 'ai': 0.50, 'demand': 0.80,
                'market_reason': 'Versatility helps, but routine coding is increasingly automated.'
            },
            'Backend Developer': {
                'min': 35, 'max': 70, 'ai': 0.60, 'demand': 0.70,
                'market_reason': 'Logic generation via AI is high, but architectural depth is still human-led.'
            },
            'Data Analyst': {
                'min': 45, 'max': 80, 'ai': 0.75, 'demand': 0.65,
                'market_reason': 'High risk as GenAI excels at data cleaning and visualization.'
            },
            'Frontend Developer': {
                'min': 50, 'max': 85, 'ai': 0.85, 'demand': 0.60,
                'market_reason': 'Very high risk; AI can generate UI from design or descriptions.'
            }
        }

        # Match Role
        normalized_role = raw_role
        rule = None
        for key, r in role_rules.items():
            if key.replace(" ", "").lower() == no_space_role:
                rule = r
                normalized_role = key
                break
        
        if not rule:
            rule = {'min': 30, 'max': 70, 'ai': 0.5, 'demand': 0.6, 'market_reason': 'General market competition.'}

        # 3. SKILL PROCESSING
        user_skills_raw = [s.strip() for s in data.skills.split(',') if s.strip()]
        proficiency = data.proficiency or {}
        
        # Proficiency weights
        prof_weights = {"Beginner": 1.2, "Intermediate": 1.0, "Advanced": 0.8, "Expert": 0.6}
        
        strength_score = 0
        total_p_weight = 0
        for skill in user_skills_raw:
            level = proficiency.get(skill, "Intermediate")
            weight = prof_weights.get(level, 1.0)
            total_p_weight += weight
        
        avg_proficiency_weight = total_p_weight / len(user_skills_raw) if user_skills_raw else 1.2
        
        # 4. DOMAIN MAPPING (Relevance & Diversity)
        domain_mapping = {
            "Frontend": ["react", "vue", "angular", "javascript", "typescript", "html", "css", "tailwind", "nextjs"],
            "Backend": ["nodejs", "python", "java", "go", "rust", "django", "fastapi", "spring"],
            "Database": ["sql", "postgresql", "mongodb", "redis", "mysql", "cassandra"],
            "Cloud": ["aws", "azure", "google cloud", "cloud", "terraform"],
            "DevOps": ["docker", "kubernetes", "jenkins", "ci/cd", "ansible"],
            "AI/ML": ["machine learning", "ai", "generative ai", "tensorflow", "pytorch", "nlp", "llm"],
            "Cybersecurity": ["cybersecurity", "security", "penetration testing", "ethical hacking"]
        }

        domains_detected = set()
        relevant_skills_count = 0
        outcome_impact_skills = ["ai", "machine learning", "generative ai", "aws", "azure", "google cloud", "cybersecurity", "kubernetes"]
        impact_detected = []
        
        for skill in user_skills_raw:
            s_lower = skill.lower()
            found_in_domain = False
            for domain, skills in domain_mapping.items():
                if any(ds in s_lower for ds in skills):
                    domains_detected.add(domain)
                    found_in_domain = True
            
            # Check for role relevance
            role_domain = None
            for d, sks in domain_mapping.items():
                if d.lower() in normalized_role.lower():
                    role_domain = d
                    break
            
            if role_domain and any(ds in s_lower for ds in domain_mapping[role_domain]):
                relevant_skills_count += 1
            
            if any(is_sk in s_lower for is_sk in outcome_impact_skills):
                impact_detected.append(skill)

        # 5. ANALYSIS LOGIC
        strengths = []
        risk_factors = []
        
        # Removed Experience Analysis based on user request (layoff must be done based on skill not experience)
        adj = 0

        # Skill Strength
        if avg_proficiency_weight < 0.8:
            adj -= 15
            strengths.append("Deep Expertise: High average proficiency in listed skills.")
        elif avg_proficiency_weight > 1.1:
            adj += 15
            risk_factors.append("Low Skill Maturity: Most skills are at a beginner level.")

        # Skill Relevance
        relevance_ratio = relevant_skills_count / len(user_skills_raw) if user_skills_raw else 0
        if relevance_ratio < 0.3:
            adj += 12
            risk_factors.append("Role Mismatch: Many listed skills are not directly relevant to the current role.")

        # Skill Diversity (Trending, Cross-Domain, Impact)
        diversity_score = 0
        if len(domains_detected) >= 3:
            diversity_score += 15
            adj -= 15
            strengths.append(f"Full-Stack Versatility: Expertise across {len(domains_detected)} domains.")
        
        if any(is_sk in [s.lower() for s in user_skills_raw] for is_sk in ["generative ai", "ai", "llm"]):
            diversity_score += 10
            adj -= 12
            strengths.append("AI-Ready: Direct knowledge of Generative AI/LLMs.")

        if impact_detected:
            adj -= 10
            strengths.append(f"Impactful Skills: Knowledge of {', '.join(impact_detected[:2])} drives business value.")

        # 6. FINAL SCORE
        base_risk = (rule['min'] + rule['max']) / 2
        final_score = max(rule['min'], min(base_risk + adj, rule['max']))
        risk_level = "Low Risk" if final_score <= 35 else "Medium Risk" if final_score <= 65 else "High Risk"

        # 7. ALTERNATE ROLES
        suggested_roles = []
        if "Frontend" in domains_detected and "Backend" in domains_detected:
            suggested_roles.append("Full Stack Developer")
        if "AI/ML" in domains_detected:
            suggested_roles.append("Machine Learning Engineer")
        if "Cloud" in domains_detected or "DevOps" in domains_detected:
            suggested_roles.append("Cloud Architect" if data.years_experience > 5 else "Cloud Engineer")
        if "Database" in domains_detected and "Backend" in domains_detected:
            suggested_roles.append("Data Engineer")
        
        if not suggested_roles:
            suggested_roles = ["Software Engineer", "Systems Architect"]

        return {
            "layoff_risk": round(final_score, 2),
            "career_risk_score": round(final_score, 2),
            "risk_level": risk_level,
            "career_strengths": strengths,
            "key_risk_factors": risk_factors,
            "skill_diversity_summary": f"Detected expertise in {', '.join(domains_detected)}. Diversity index is {'High' if diversity_score > 20 else 'Moderate'}.",
            "recommended_skills": ["Generative AI", "Cloud Architecture", "Cybersecurity"] if "AI/ML" not in domains_detected else ["Kubernetes", "DevSecOps"],
            "suggested_alternate_roles": list(set(suggested_roles))
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    except Exception as e:
        # Provide a clear error message in English to the Frontend
        print(f"Server Error: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"Prediction Error: {str(e)}. Please check your input and try again."
        )

@app.post("/roadmap")
async def generate_roadmap(data: RoadmapRequest):
    if not genai_api_key:
        raise HTTPException(status_code=500, detail="Gemini API Key missing")
        
    prompt = f"""
    You are an expert Career Agent helping tech professionals pivot safely.
    Role: {data.role}
    Experience: {data.years_experience} years
    Skills: {data.skills}
    Current Layoff Risk Level: {data.risk_level}
    
    Provide a highly personalized, practical, and dynamic career shift roadmap mapped to their specific skills and experience level to reduce layoff risk. 
    Format your response in Markdown with the following structured sections:
    
    ### 🎯 Target Roles
    Suggest 2-3 specific job roles that are highly stable and match their current skills closely. Explain why each fits.
    
    ### 🚀 Skills to Acquire
    Identify 3-5 specific gaps between their current skills and the target roles. Tell them exactly what to learn.
    
    ### 📚 Recommended Resources
    Provide 3 actionable resources to learn these skills (certifications, popular courses, specific documentation).
    
    ### 📈 3-Month Action Plan
    A short week-by-week or month-by-month actionable plan to start transitioning.
    """
    
    try:
        model = genai.GenerativeModel('gemini-2.5-flash-8b') # use flash for speed
        response = model.generate_content(prompt)
        return {"roadmap": response.text}
    except Exception as e:
        print(f"Agent Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to run the AI Agent")

@app.post("/chat")
async def chat_agent(data: ChatRequest):
    if not genai_api_key:
        raise HTTPException(status_code=500, detail="Gemini API Key missing")
        
    system_prompt = f"You are a helpful, encouraging career advisor. The user is a {data.role} with skills: {data.skills}. Their current layoff risk is {data.risk_level}. They need very conversational and short advice (max 2-3 sentences). Answer this question: {data.message}"
    
    try:
        model = genai.GenerativeModel('gemini-2.5-flash-8b')
        response = model.generate_content(system_prompt)
        return {"reply": response.text}
    except Exception as e:
        print(f"Chat Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to respond")
