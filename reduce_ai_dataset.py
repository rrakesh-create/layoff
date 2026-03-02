import pandas as pd

# -----------------------------
# LOAD EXCEL DATASET
# -----------------------------
df = pd.read_excel(
    r"D:\ai_impact_jobs_2010_2025.xlsx"
)

# lowercase titles
df["job_title"] = df["job_title"].astype(str).str.lower()

# remove empty rows
df.dropna(subset=["job_title"], inplace=True)

# -----------------------------
# IT KEYWORDS FILTER
# -----------------------------
it_keywords = [
    "developer", "engineer", "software", "data",
    "analyst", "cloud", "devops", "backend",
    "frontend", "full stack", "machine learning",
    "ai", "cyber", "security", "network",
    "database", "web", "system", "architect",
    "programmer", "it", "qa", "test"
]

# keep only IT roles
df_it = df[
    df["job_title"].apply(
        lambda x: any(keyword in x for keyword in it_keywords)
    )
]

# -----------------------------
# LIMIT DUPLICATES PER ROLE
# -----------------------------
limited_df = (
    df_it.groupby("job_title")
    .apply(lambda x: x.head(12))   # change 10–15 if needed
    .reset_index(drop=True)
)

# -----------------------------
# SAVE CLEAN DATASET
# -----------------------------
limited_df.to_csv(
    r"D:\ai_impact_jobs_IT_reduced.csv",
    index=False
)

# -----------------------------
# PRINT INFO
# -----------------------------
print("Original Rows:", len(df))
print("After IT Filter:", len(df_it))
print("Final Reduced Rows:", len(limited_df))
print("Unique IT Roles:",
      limited_df["job_title"].nunique())