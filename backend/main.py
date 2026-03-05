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
        
        # 2. MARKET-DRIVEN ROLE BOUNDARIES (Automation Risks) - UPDATED FOR ACCURACY
        role_rules = {
            'Cybersecurity Analyst': {
                'min': 5, 'max': 22, 'ai_impact': 0.15, 'demand': 0.98, 
                'market_reason': 'Extremely high demand due to rising cyber threats; AI is a co-pilot, not a replacement.'
            },
            'ML Engineer': {
                'min': 8, 'max': 28, 'ai_impact': 0.10, 'demand': 0.96,
                'market_reason': 'They build the future; demand is booming while supply is low.'
            },
            'Data Engineer': {
                'min': 10, 'max': 32, 'ai_impact': 0.20, 'demand': 0.94,
                'market_reason': 'Data infrastructure is the foundation for all AI; critical roles.'
            },
            'DevOps Engineer': {
                'min': 12, 'max': 38, 'ai_impact': 0.25, 'demand': 0.92,
                'market_reason': 'Complexity of infrastructure-as-code protects these roles.'
            },
            'Cloud Architect': {
                'min': 10, 'max': 30, 'ai_impact': 0.15, 'demand': 0.95,
                'market_reason': 'Strategic high-level design remains a human-centric skill.'
            },
            'Backend Developer': {
                'min': 20, 'max': 55, 'ai_impact': 0.45, 'demand': 0.85,
                'market_reason': 'Logic is being automated, but complex system architecture is safe.'
            },
            'Full Stack Developer': {
                'min': 25, 'max': 65, 'ai_impact': 0.55, 'demand': 0.82,
                'market_reason': 'Versatility is a buffer, but routine CRUD tasks are highly automatable.'
            },
            'Frontend Developer': {
                'min': 35, 'max': 75, 'ai_impact': 0.75, 'demand': 0.70,
                'market_reason': 'High risk; GenAI can translate wireframes to code with 90% accuracy.'
            },
            'QA Engineer': {
                'min': 45, 'max': 85, 'ai_impact': 0.85, 'demand': 0.50,
                'market_reason': 'Automation testing is increasingly handleable by AI agents.'
            },
            'System Architect': {
                'min': 5, 'max': 25, 'ai_impact': 0.10, 'demand': 0.90,
                'market_reason': 'High-level decision making and trade-off analysis is hard for AI.'
            }
        }

        # Match Role
        normalized_role = raw_role
        rule = None
        for key, r in role_rules.items():
            # More precise matching
            target_key = key.replace(" ", "").lower()
            if target_key == no_space_role or target_key in no_space_role or no_space_role in target_key:
                rule = r
                normalized_role = key
                break
        
        if not rule:
            rule = {'min': 30, 'max': 70, 'ai_impact': 0.5, 'demand': 0.65, 'market_reason': 'General market competition.'}

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
        
        # 4. DOMAIN MAPPING (Role-Skill Validation Dataset)
        domain_mapping = {
            "Frontend": ["react", "angular", "vue", "javascript", "typescript", "html", "css", "next.js", "tailwind", "sass", "webpack", "vite"],
            "Backend": ["node.js", "express", "django", "flask", "spring boot", "fastapi", "java", "python", "go", "rust", "laravel", "php", "ruby", "rails"],
            "Data Scientist": ["python", "pandas", "numpy", "machine learning", "tensorflow", "pytorch", "statistics", "scikit-learn", "data science"],
            "Cybersecurity": ["cybersecurity", "security", "penetration testing", "ethical hacking", "siem", "cryptography", "firewall", "zero trust"],
            "DevOps": ["docker", "kubernetes", "jenkins", "ci/cd", "ansible", "terraform", "prometheus", "grafana", "git"],
            "ML Engineer": ["machine learning", "ai", "generative ai", "tensorflow", "pytorch", "nlp", "llm", "keras", "scikit", "pandas", "numpy"],
            "Cloud": ["aws", "azure", "google cloud", "cloud", "lambda", "s3", "ec2", "serverless"]
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

        # 5. ROLE-SKILL VALIDATION RULE
        # Risk calculation should only proceed if at least one skill matches the role's domain
        if relevant_skills_count == 0:
            raise HTTPException(
                status_code=400,
                detail=f"The entered skills do not match the selected role: {data.role}. Please enter skills relevant to the selected role in order to calculate layoff risk."
            )

        # 6. ANALYSIS LOGIC
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

        # Skill Relevance (HEAVILY WEIGHTED)
        relevance_ratio = relevant_skills_count / len(user_skills_raw) if user_skills_raw else 0
        if relevance_ratio < 0.2:
            adj += 35
            risk_factors.append("Critical Role Mismatch: Your skills do not align with your designation, creating high redundancy risk.")
        elif relevance_ratio < 0.4:
            adj += 20
            risk_factors.append("Moderate Role Mismatch: Many listed skills are not directly relevant to the current role's core requirements.")

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

        # 6. FINAL SCORE - SOPHISTICATED ALGORITHM
        # Weighted average of base risk, AI impact, and skill buffers
        unadjusted_risk = (rule['min'] + rule['max']) / 2
        
        # Skill Buffer (how much the user's specific skills offset the role's general risk)
        skill_buffer = 0
        if avg_proficiency_weight < 0.7:  # Expert
             skill_buffer -= 20
        elif avg_proficiency_weight < 0.9: # Advanced
             skill_buffer -= 10
        elif avg_proficiency_weight > 1.1: # Beginner
             skill_buffer += 10
             
        # Demand Buffer
        demand_buffer = (1 - rule['demand']) * 20  # Lower demand = higher risk
        
        final_score = unadjusted_risk + adj + skill_buffer + demand_buffer
        final_score = max(5, min(98, final_score)) # Clamp between 5% and 98%
        
        risk_level = "Low Risk" if final_score <= 30 else "Medium Risk" if final_score <= 60 else "High Risk"

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
            "explanations": strengths + risk_factors,
            "skill_diversity_summary": f"Detected expertise in {', '.join(domains_detected)}. Diversity index is {'High' if diversity_score > 20 else 'Moderate'}.",
            "recommended_skills": ["Generative AI", "Cloud Architecture", "Cybersecurity"] if "AI/ML" not in domains_detected else ["Kubernetes", "DevSecOps"],
            "suggested_alternate_roles": list(set(suggested_roles))
        }

    except HTTPException as e:
        raise e
    except Exception as e:
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
    You are an ELITE Career AI Agent focusing on MARKET STABILITY and UPSKILLING.
    User Profile:
    - Current Role: {data.role}
    - Years of Experience: {data.years_experience}
    - Current Specific Skills: {data.skills}
    - ASSESSED LAYOFF RISK: {data.risk_level}
    
    TASK: Generate a high-impact, custom 4-5 point Action Plan to insulate this user from market volatility in their CURRENT role. 
    Focus on "Niche Specialization" and "High-Impact Technologies" (like Cloud, AI integration, Large Scale Infrastructure).
    
    CRITICAL RULES:
    1. Focus on deep competency in CURRENT role first.
    2. Identify specific certifications or real-world projects they should build.
    3. Be extremely practical and action-oriented.
    4. Return ONLY a raw JSON array of strings. No markdown, no "json" label.
    Example: ["Obtain AWS Certified Solutions Architect Associate", "Implement a RAG-based AI feature in your current team", "Master K8s operator patterns"]
    """
    
    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(prompt)
        import json
        text = response.text.strip('` \n')
        if text.startswith('json'):
            text = text[4:].strip()
        plan = json.loads(text)
        return {"action_plan": plan}
    except Exception as e:
        print(f"Agent Error: {e}")
        return {"action_plan": ["Focus on building strong foundational knowledge", "Expand your domain expertise", "Stay updated with emerging trends in your field"]}

@app.post("/chat")
async def chat_agent(data: ChatRequest):
    if not genai_api_key:
        raise HTTPException(status_code=500, detail="Gemini API Key missing")
        
    system_prompt = f"You are a helpful, encouraging career advisor. The user is a {data.role} with skills: {data.skills}. Their current layoff risk is {data.risk_level}. They need very conversational and short advice (max 2-3 sentences). Answer this question: {data.message}"
    
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(system_prompt)
        return {"reply": response.text}
    except Exception as e:
        print(f"Chat Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to respond")
