import { useState } from "react";
import axios from "axios";
import { roleSkills } from "./data";

export default function InputForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const [form, setForm] = useState({
    role: "",
    skills: "",
    years_experience: 1
  });

  const [roleInput, setRoleInput] = useState("");
  const [roleSuggestions, setRoleSuggestions] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [skillSuggestions, setSkillSuggestions] = useState([]);

  /* ================= ROLE SEARCH ================= */
  const handleRoleChange = (e) => {
    const value = e.target.value;
    setRoleInput(value);
    const roles = Object.keys(roleSkills);
    setRoleSuggestions(roles.filter(r => r.toLowerCase().includes(value.toLowerCase())));
  };

  /* ================= SKILL SEARCH ================= */
  const handleSkillChange = (e) => {
    const value = e.target.value;
    setSkillInput(value);
    const skills = roleSkills[form.role] || [];
    const parts = value.split(",");
    const lastWord = parts[parts.length - 1].trim().toLowerCase();
    if (!lastWord) {
      setSkillSuggestions([]);
      return;
    }
    const filtered = skills.filter(skill => skill.toLowerCase().includes(lastWord));
    setSkillSuggestions(filtered);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await axios.post("http://127.0.0.1:8000/predict", form);
      setTimeout(() => {
        setResult(res.data);
        setLoading(false);
      }, 900);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  /* ================= STYLES ================= */
  const mainContainer = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
    padding: "40px 20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  };

  const card = {
    background: "rgba(255,255,255,0.9)",
    padding: "35px",
    borderRadius: "16px",
    width: "420px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.2)"
  };

  const input = {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    outline: "none",
    boxSizing: "border-box"
  };

  const button = {
    width: "100%",
    padding: "14px",
    borderRadius: "8px",
    border: "none",
    background: "linear-gradient(90deg,#2563eb,#06b6d4,#22c55e)",
    color: "white",
    fontWeight: "bold",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer"
  };

  /* Risk Meter Styles */
  const meterContainer = {
    marginTop: "25px",
    padding: "20px",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    width: "420px",
    textAlign: "center"
  };

  const progressBg = {
    width: "100%",
    height: "20px",
    background: "#eee",
    borderRadius: "10px",
    overflow: "hidden",
    margin: "15px 0",
    position: "relative"
  };

  const getRiskColor = (risk) => {
    if (risk < 35) return "#22c55e"; // Green
    if (risk < 65) return "#eab308"; // Yellow
    return "#ef4444"; // Red
  };

  return (
    <div style={mainContainer}>
      <style>
        {`
          @keyframes spin{ 0%{transform:rotate(0)} 100%{transform:rotate(360deg)} }
          @keyframes slideIn{ from{opacity:0; transform:translateY(10px)} to{opacity:1; transform:translateY(0)} }
        `}
      </style>

      <form style={card} onSubmit={handleSubmit}>
        <h2 style={{ textAlign: "center", color: "#1e293b" }}>Career Risk Radar</h2>

        {/* ROLE INPUT */}
        <div style={{ position: "relative" }}>
          <input
            style={input}
            placeholder="Type Role"
            value={roleInput}
            onChange={handleRoleChange}
          />
          {roleSuggestions.length > 0 && roleInput && (
            <div style={{
              position: "absolute", top: "42px", left: 0, right: 0,
              background: "white", borderRadius: "8px", border: "1px solid #ddd",
              maxHeight: "120px", overflowY: "auto", zIndex: 10
            }}>
              {roleSuggestions.slice(0, 5).map(role => (
                <div
                  key={role}
                  style={{ padding: "8px 12px", fontSize: "14px", cursor: "pointer" }}
                  onClick={() => {
                    setForm({ ...form, role });
                    setRoleInput(role.replace(/([A-Z])/g, " $1").trim());
                    setRoleSuggestions([]);
                  }}
                >
                  {role.replace(/([A-Z])/g, " $1").trim()}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SKILLS INPUT */}
        <div style={{ position: "relative" }}>
          <input
            style={input}
            placeholder="Type Skills (e.g. React, Python)"
            value={skillInput}
            onChange={handleSkillChange}
          />
          {skillSuggestions.length > 0 && skillInput && (
            <div style={{
              position: "absolute", top: "42px", left: 0, right: 0,
              background: "white", borderRadius: "8px", border: "1px solid #ddd",
              maxHeight: "120px", overflowY: "auto", zIndex: 10
            }}>
              {skillSuggestions.slice(0, 5).map(skill => (
                <div
                  key={skill}
                  style={{ padding: "8px 12px", fontSize: "14px", cursor: "pointer" }}
                  onClick={() => {
                    const parts = skillInput.split(",");
                    parts[parts.length - 1] = ` ${skill}`;
                    const updated = parts.join(",").replace(/^ /, "");
                    setSkillInput(updated);
                    setForm({ ...form, skills: updated });
                    setSkillSuggestions([]);
                  }}
                >
                  {skill}
                </div>
              ))}
            </div>
          )}
        </div>

        <input
          style={input}
          type="number"
          placeholder="Years Experience"
          onChange={(e) => setForm({ ...form, years_experience: e.target.value })}
        />

        <button style={button} disabled={loading}>
          {loading ? (
            <>
              <div style={{ width: "18px", height: "18px", border: "3px solid white", borderTop: "3px solid transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
              Predicting Risk...
            </>
          ) : "Predict Risk"}
        </button>
      </form>

      {/* ================= RESULT & RISK METER ================= */}
      
      {result && !loading && (
        <div style={{ ...meterContainer, animation: "slideIn 0.5s ease" }}>
          <h3 style={{ margin: "0", color: "#334155" }}>Risk Analysis for {result.role}</h3>
          
          <div style={{ fontSize: "32px", fontWeight: "bold", margin: "10px 0", color: getRiskColor(result.layoff_risk) }}>
            {result.layoff_risk}%
          </div>
          
          <div style={{ fontWeight: "600", color: "#64748b", marginBottom: "5px" }}>
            Risk Level: {result.risk_level}
          </div>

          <div style={progressBg}>
            <div style={{
              width: `${result.layoff_risk}%`,
              height: "100%",
              background: getRiskColor(result.layoff_risk),
              transition: "width 1s ease-in-out"
            }} />
          </div>

          {/* EXPLANATIONS SECTION */}
          <div style={{ textAlign: "left", marginTop: "20px", borderTop: "1px solid #eee", paddingTop: "15px" }}>
            <h4 style={{ margin: "0 0 10px 0", fontSize: "14px", color: "#1e293b" }}>Why this score?</h4>
            <ul style={{ paddingLeft: "20px", margin: "0", fontSize: "13px", color: "#475569", lineHeight: "1.6" }}>
              {result.explanations && result.explanations.map((msg, idx) => (
                <li key={idx} style={{ marginBottom: "5px" }}>{msg}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}