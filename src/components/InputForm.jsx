import React, { useState, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Target, Zap, Activity, Briefcase, Loader2, Info } from 'lucide-react';
import { roleSkills } from "./data";

export default function VantageAI() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [form, setForm] = useState({ role: "", skills: "", years_experience: "" });

    // Input States
    const [roleInput, setRoleInput] = useState("");
    const [roleSuggestions, setRoleSuggestions] = useState([]);
    const [activeRoleIdx, setActiveRoleIdx] = useState(-1);

    const [skillInput, setSkillInput] = useState("");
    const [skillSuggestions, setSkillSuggestions] = useState([]);
    const [activeSkillIdx, setActiveSkillIdx] = useState(-1);

    const skillInputRef = useRef(null);

    const formatWord = (text) => text.replace(/([A-Z])/g, " $1").trim();

    // --- Role Selection Logic ---
    const handleRoleChange = (e) => {
        const val = e.target.value;
        setRoleInput(val);
        const filtered = Object.keys(roleSkills).filter(r => r.toLowerCase().includes(val.toLowerCase()));
        setRoleSuggestions(val ? filtered : []);
        setActiveRoleIdx(-1);
    };

    const selectRole = (role) => {
        setForm({ ...form, role: role });
        setRoleInput(formatWord(role));
        setRoleSuggestions([]);
        // Role select ayyaka skills field ki focus veltundi
        setTimeout(() => skillInputRef.current.focus(), 10);
    };

    // --- Skill Selection Logic (Fixed) ---
    const handleSkillChange = (e) => {
        const val = e.target.value;
        setSkillInput(val);

        if (!form.role) return;

        // Comma tho split chesi last word ni mathrame suggest chestham
        const parts = val.split(",");
        const lastPart = parts[parts.length - 1].trim().toLowerCase();
        
        const available = roleSkills[form.role] || [];
        
        // Match ayye skills ni filter cheyadam
        const filtered = lastPart 
            ? available.filter(s => s.toLowerCase().includes(lastPart) && !val.includes(s)) 
            : [];
            
        setSkillSuggestions(filtered);
        setActiveSkillIdx(-1);
    };

    const selectSkill = (skill) => {
        const parts = skillInput.split(",");
        // Last type chestunna word ni poorthi skill thoo replace cheyadam
        parts[parts.length - 1] = ` ${skill}`;
        const finalStr = parts.join(", ").trim().replace(/^,/, "");
        
        setSkillInput(finalStr + ", "); // Next skill kosam comma add chesthunnam
        setForm({ ...form, skills: finalStr });
        setSkillSuggestions([]);
        
        // Cursor ni thirigi input loki pampadam
        setTimeout(() => {
            skillInputRef.current.focus();
        }, 10);
    };

    // Keyboard Navigation Function
    const handleKeyDown = (e, suggestions, activeIdx, setActiveIdx, onSelect) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIdx(p => (p < suggestions.length - 1 ? p + 1 : p));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIdx(p => (p > 0 ? p - 1 : p));
        } else if (e.key === "Enter" && activeIdx >= 0) {
            e.preventDefault();
            onSelect(suggestions[activeIdx]);
        }
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Spaces ni remove chesi data prepare cheyadam
    // "M L Engineer" becomes "MLEngineer"
    const cleanedForm = {
        ...form,
        role: form.role.replace(/\s+/g, ''), 
        years_experience: parseFloat(form.years_experience)
    };

    try {
        const res = await axios.post("http://127.0.0.1:8000/predict", cleanedForm);
        setResult(res.data);
    } catch (err) {
        console.error("Error:", err);
        alert("Prediction failed. Please ensure the 'Role' is selected from the suggestions.");
    }
    setLoading(false);
};

    return (
        <div style={styles.page}>
            {/* Background Blobs */}
            <div style={{...styles.blob, background: "#bae6fd", top: "5%", left: "10%"}} />
            <div style={{...styles.blob, background: "#bbf7d0", bottom: "5%", right: "10%"}} />

            <div style={styles.container}>
                <div style={styles.card}>
                    <div style={styles.header}>
                        <ShieldCheck color="#2563eb" size={28} strokeWidth={2.5} />
                        <h2 style={styles.title}>Vantage <span style={{color: '#2563eb'}}>AI</span></h2>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Designation Input */}
                        <div style={styles.inputGroup}>
                            <label style={styles.label}><Briefcase size={14} /> DESIGNATION</label>
                            <input 
                                style={styles.input} 
                                value={roleInput} 
                                onChange={handleRoleChange}
                                onKeyDown={(e) => handleKeyDown(e, roleSuggestions, activeRoleIdx, setActiveRoleIdx, selectRole)}
                                placeholder="E.g. Software Engineer"
                            />
                            {roleSuggestions.length > 0 && (
                                <div style={styles.suggestBox}>
                                    {roleSuggestions.map((r, i) => (
                                        <div key={r} 
                                             onMouseEnter={() => setActiveRoleIdx(i)}
                                             onClick={() => selectRole(r)} 
                                             style={i === activeRoleIdx ? styles.activeItem : styles.suggestItem}>
                                             {formatWord(r)}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Skills Input */}
                        <div style={styles.inputGroup}>
                            <label style={styles.label}><Zap size={14} /> SKILLS</label>
                            <input 
                                ref={skillInputRef}
                                style={styles.input} 
                                value={skillInput} 
                                onChange={handleSkillChange}
                                onKeyDown={(e) => handleKeyDown(e, skillSuggestions, activeSkillIdx, setActiveSkillIdx, selectSkill)}
                                placeholder="React, Python, SQL..."
                            />
                            {skillSuggestions.length > 0 && (
                                <div style={styles.suggestBox}>
                                    {skillSuggestions.map((s, i) => (
                                        <div key={s} 
                                             onMouseEnter={() => setActiveSkillIdx(i)}
                                             onClick={() => selectSkill(s)} 
                                             style={i === activeSkillIdx ? styles.activeItem : styles.suggestItem}>
                                             {s}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}><Target size={14} /> EXPERIENCE (YEARS)</label>
                            <input style={styles.input} type="number" value={form.years_experience} onChange={(e) => setForm({ ...form, years_experience: e.target.value })} placeholder="0" />
                        </div>

                        <button type="submit" style={styles.button} disabled={loading}>
                            {loading ? (
                                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}>
                                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                                        <Loader2 size={18} />
                                    </motion.div>
                                    Predicting Risk...
                                </div>
                            ) : "Predict Risk"}
                        </button>
                    </form>
                </div>

                {/* Result Section */}
                <AnimatePresence>
                    {result && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{...styles.card, width: "380px"}}>
                            <div style={{textAlign: 'center', marginBottom: '20px'}}>
                                <h4 style={styles.sideTitle}>Risk Assessment</h4>
                                <div style={{fontSize: '11px', color: '#94a3b8'}}>Market Analysis Result</div>
                            </div>
                            
                            <div style={styles.gaugeArea}>
                                <svg width="160" height="90" viewBox="0 0 200 110">
                                    <path d="M20,100 A80,80 0 0,1 180,100" fill="none" stroke="#f1f5f9" strokeWidth="16" strokeLinecap="round"/>
                                    <path d="M20,100 A80,80 0 0,1 180,100" fill="none" stroke="url(#g)" strokeWidth="16" strokeLinecap="round" strokeDasharray="251" strokeDashoffset={251 - (251 * result.layoff_risk) / 100} />
                                    <defs><linearGradient id="g"><stop offset="0%" stopColor="#22c55e"/><stop offset="60%" stopColor="#f59e0b"/><stop offset="100%" stopColor="#ef4444"/></linearGradient></defs>
                                </svg>
                                <div style={styles.riskScore}>{result.layoff_risk}%</div>
                            </div>

                            <div style={styles.expContainer}>
                                {result.explanations.map((text, i) => (
                                    <div key={i} style={styles.expItem}>
                                        <Info size={14} style={{color: '#3b82f6', marginTop: '2px', flexShrink: 0}} />
                                        <span>{text}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

const styles = {
    page: { width: "100vw", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #f0fdf4, #f0f9ff, #eff6ff)", overflow: "hidden" },
    blob: { position: "absolute", width: "400px", height: "400px", borderRadius: "50%", opacity: 0.4, filter: "blur(90px)" },
    container: { display: "flex", gap: "25px", zIndex: 5, alignItems: "flex-start" },
    card: { background: "rgba(255,255,255,0.96)", padding: "30px", borderRadius: "24px", width: "350px", boxShadow: "0 10px 40px rgba(0,0,0,0.06)", border: "1px solid #fff" },
    header: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "30px" },
    title: { fontSize: "22px", fontWeight: "800", color: "#1e293b", margin: 0 },
    inputGroup: { position: "relative", marginBottom: "15px" },
    label: { display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: "700", color: "#94a3b8", marginBottom: "6px" },
    input: { width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1.5px solid #f1f5f9", fontSize: "14px", outline: "none", boxSizing: "border-box" },
    suggestBox: { position: "absolute", top: "75px", left: 0, right: 0, background: "white", borderRadius: "12px", boxShadow: "0 15px 30px rgba(0,0,0,0.12)", zIndex: 100, overflow: "hidden", border: "1px solid #f1f5f9" },
    suggestItem: { padding: "10px 15px", fontSize: "13px", color: "#475569", cursor: "pointer" },
    activeItem: { padding: "10px 15px", fontSize: "13px", color: "#2563eb", background: "#f0f7ff", cursor: "pointer", fontWeight: "600" },
    button: { width: "100%", padding: "14px", marginTop: "10px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #2563eb, #0ea5e9)", color: "white", fontWeight: "700", cursor: "pointer" },
    sideTitle: { fontSize: "18px", fontWeight: "700", color: "#1e293b", margin: 0 },
    gaugeArea: { textAlign: "center", position: "relative", marginBottom: "10px" },
    riskScore: { fontSize: "32px", fontWeight: "900", marginTop: "-30px", color: "#1e293b" },
    expContainer: { marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px" },
    expItem: { display: "flex", gap: "10px", background: "#f8fafc", padding: "12px", borderRadius: "12px", fontSize: "12.5px", color: "#475569", border: "1px solid #f1f5f9" }
};