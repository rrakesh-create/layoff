import pandas as pd

# 1️⃣ Load dataset
df = pd.read_csv(r"C:\Users\ASUS\Downloads\ai_impact_jobs_2010_2025.csv")

# 2️⃣ Handle missing AI skills
df["ai_skills"] = df["ai_skills"].fillna("")

# 3️⃣ Keep only required columns
df = df[[
    "industry",
    "job_title",
    "core_skills",
    "ai_skills",
    "ai_intensity_score",
    "automation_risk_score",
    "industry_ai_adoption_stage"
]]

# 4️⃣ Limit max 15 rows per role (but keep all roles)
limited_df = df.groupby("job_title").head(25).copy()

print("Total rows after limiting:", len(limited_df))
print("Unique roles:", limited_df["job_title"].nunique())

# 5️⃣ Merge skills
limited_df["combined_skills"] = (
    limited_df["core_skills"].fillna("") + "," +
    limited_df["ai_skills"].fillna("")
)

# 6️⃣ Aggregate per role
grouped = limited_df.groupby("job_title").agg({
    "ai_intensity_score": "mean",
    "automation_risk_score": "mean",
    "combined_skills": lambda x: ",".join(
        sorted(set(",".join(x).split(",")))
    ),
    "industry_ai_adoption_stage": lambda x: x.mode()[0]
}).reset_index()

# 7️⃣ Convert industry stage → demand score
stage_map = {
    "Growing": 1.0,
    "Emerging": 0.6
}

grouped["demand_score"] = grouped["industry_ai_adoption_stage"].map(stage_map)

# 8️⃣ Risk score formula
grouped["risk_score"] = (
    grouped["automation_risk_score"] * 0.5 +
    grouped["ai_intensity_score"] * 0.3 +
    (1 - grouped["demand_score"]) * 0.2
)

# 9️⃣ Convert to percentage
grouped["risk_percentage"] = (grouped["risk_score"] * 100).round(2)

# 🔟 Risk category classification
def categorize_risk(score):
    if score >= 70:
        return "High"
    elif score >= 40:
        return "Moderate"
    else:
        return "Low"

grouped["risk_category"] = grouped["risk_percentage"].apply(categorize_risk)

# 1️⃣1️⃣ Final dataset print
print("\nFinal Risk Results:\n")
print(grouped[[
    "job_title",
    "risk_percentage",
    "risk_category"
]])

# 1️⃣2️⃣ Save final dataset
grouped.to_csv("career_risk_role_dataset.csv", index=False)
print("\nSaved as career_risk_role_dataset.csv")