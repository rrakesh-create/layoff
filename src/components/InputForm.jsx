import React, { useState, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Target, Zap, Briefcase, Loader2, Info, LayoutDashboard, Lightbulb } from 'lucide-react';
// Import both datasets from your data.js
import { roleSkills, careerShifts } from "./data"; 

export default function VantageAI() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [activeTab, setActiveTab] = useState("risk"); 
    const [form, setForm] = useState({ role: "", skills: "", years_experience: "" });

    // --- Input UI States ---
    const [roleInput, setRoleInput] = useState("");
    const [roleSuggestions, setRoleSuggestions] = useState([]);
    const [activeRoleIdx, setActiveRoleIdx] = useState(-1);
    const [skillInput, setSkillInput] = useState("");
    const [skillSuggestions, setSkillSuggestions] = useState([]);
    const [activeSkillIdx, setActiveSkillIdx] = useState(-1);

    const skillInputRef = useRef(null);
    const formatWord = (text) => text ? text.replace(/([A-Z])/g, " $1").trim() : "";

    // --- Risk Level Info Logic ---
    const getRiskInfo = (score) => {
        if (score <= 30) return { label: "LOW RISK", color: "#22c55e" };
        if (score <= 70) return { label: "MEDIUM RISK", color: "#f59e0b" };
        return { label: "HIGH RISK", color: "#ef4444" };
    };

    // --- Handlers ---
    const handleRoleChange = (e) => {
        const val = e.target.value;
        setRoleInput(val);
        const filtered = Object.keys(roleSkills || {}).filter(r => r.toLowerCase().includes(val.toLowerCase()));
        setRoleSuggestions(val ? filtered : []);
        setActiveRoleIdx(-1);
    };

    const selectRole = (role) => {
        setForm(prev => ({ ...prev, role: role }));
        setRoleInput(formatWord(role));
        setRoleSuggestions([]);
        setActiveRoleIdx(-1);
        setTimeout(() => skillInputRef.current?.focus(), 50);
    };

    const handleSkillChange = (e) => {
        const val = e.target.value;
        setSkillInput(val);
        if (!form.role) return;
        const parts = val.split(",");
        const lastPart = parts[parts.length - 1].trim().toLowerCase();
        const available = roleSkills[form.role] || [];
        const filtered = lastPart ? available.filter(s => s.toLowerCase().includes(lastPart) && !val.toLowerCase().includes(s.toLowerCase())) : [];
        setSkillSuggestions(filtered);
        setActiveSkillIdx(-1);
    };

    const selectSkill = (skill) => {
        const parts = skillInput.split(",");
        parts[parts.length - 1] = ` ${skill}`;
        const finalStr = parts.join(", ").trim().replace(/^,/, "");
        const updatedValue = finalStr + ", ";
        setSkillInput(updatedValue);
        setForm(prev => ({ ...prev, skills: finalStr }));
        setSkillSuggestions([]);
        setActiveSkillIdx(-1);
        setTimeout(() => skillInputRef.current?.focus(), 50);
    };

    const handleKeyDown = (e, suggestions, activeIdx, setActiveIdx, onSelect) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIdx(p => (p < suggestions.length - 1 ? p + 1 : p));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIdx(p => (p > 0 ? p - 1 : p));
        } else if (e.key === "Enter") {
            if (activeIdx >= 0 && suggestions[activeIdx]) {
                e.preventDefault();
                onSelect(suggestions[activeIdx]);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.role) return alert("Please select a role from suggestions.");
        setLoading(true);
        try {
            const cleanedForm = { 
                ...form, 
                role: form.role.replace(/\s+/g, ''), 
                years_experience: parseFloat(form.years_experience) || 0 
            };
            const res = await axios.post("http://127.0.0.1:8000/predict", cleanedForm);
            setResult(res.data);
            setActiveTab("risk"); 
        } catch (err) {
            alert("Analysis failed. Backend error.");
        }
        setLoading(false);
    };

    return (
        <div style={styles.page}>
            <div style={{...styles.blob, background: "#bae6fd", top: "5%", left: "10%"}} />
            <div style={{...styles.blob, background: "#bbf7d0", bottom: "5%", right: "10%"}} />

            <div style={styles.container}>
                {/* LEFT: FORM CARD */}
                <div style={styles.card}>
                    <div style={styles.header}>
                        <ShieldCheck color="#2563eb" size={32} strokeWidth={2.5} />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <h2 style={styles.title}>RiskGuard <span style={styles.titleAi}>AI</span></h2>
                            <span style={styles.subtitle}>Smart Layoff Risk Predictor</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}><Briefcase size={14} /> DESIGNATION</label>
                            <input style={styles.input} value={roleInput} onChange={handleRoleChange} onKeyDown={(e) => handleKeyDown(e, roleSuggestions, activeRoleIdx, setActiveRoleIdx, selectRole)} placeholder="Search Role..." />
                            {roleSuggestions.length > 0 && (
                                <div style={styles.suggestBox}>
                                    {roleSuggestions.map((r, i) => (
                                        <div key={r} onMouseEnter={() => setActiveRoleIdx(i)} onClick={() => selectRole(r)} style={i === activeRoleIdx ? styles.activeItem : styles.suggestItem}>{formatWord(r)}</div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}><Zap size={14} /> SKILLS</label>
                            <input ref={skillInputRef} style={styles.input} value={skillInput} onChange={handleSkillChange} onKeyDown={(e) => handleKeyDown(e, skillSuggestions, activeSkillIdx, setActiveSkillIdx, selectSkill)} placeholder="React, Python..." />
                            {skillSuggestions.length > 0 && (
                                <div style={styles.suggestBox}>
                                    {skillSuggestions.map((s, i) => (
                                        <div key={s} onMouseEnter={() => setActiveSkillIdx(i)} onClick={() => selectSkill(s)} style={i === activeSkillIdx ? styles.activeItem : styles.suggestItem}>{s}</div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}><Target size={14} /> EXPERIENCE</label>
                            <input style={styles.input} type="number" value={form.years_experience} onChange={(e) => setForm({ ...form, years_experience: e.target.value })} placeholder="Years" />
                        </div>

                        <button type="submit" style={styles.button} disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" size={20} /> : "Predict Risk"}
                        </button>
                    </form>
                </div>

                {/* RIGHT: TABS CARD */}
                <AnimatePresence>
                    {result && (
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            style={{...styles.card, width: "420px", minHeight: "500px"}}
                        >
                            <div style={styles.tabHeader}>
                                <button onClick={() => setActiveTab("risk")} style={activeTab === "risk" ? styles.activeTab : styles.tab}>
                                    <LayoutDashboard size={16} /> Risk Analysis
                                </button>
                                <button onClick={() => setActiveTab("career")} style={activeTab === "career" ? styles.activeTab : styles.tab}>
                                    <Lightbulb size={16} /> Career Shift
                                </button>
                            </div>

                            <div style={{padding: '10px', flex: 1}}>
                                <AnimatePresence mode="wait">
                                    {activeTab === "risk" && (
                                        <motion.div key="risk" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                                            <div style={styles.gaugeArea}>
                                                <svg width="240" height="130" viewBox="0 0 200 110">
                                                    <path d="M20,100 A80,80 0 0,1 180,100" fill="none" stroke="#f1f5f9" strokeWidth="12" strokeLinecap="round" />
                                                    <path d="M20,100 A80,80 0 0,1 180,100" fill="none" stroke={getRiskInfo(result.layoff_risk).color} strokeWidth="12" strokeLinecap="round" strokeDasharray="251" strokeDashoffset={251 - (251 * result.layoff_risk) / 100} style={{ transition: 'stroke-dashoffset 1.5s ease-out, stroke 0.5s' }} />
                                                </svg>
                                                <div style={styles.riskScoreContainer}>
                                                    <div style={styles.riskScore}>{result.layoff_risk}%</div>
                                                    <div style={{...styles.riskLevelLabel, color: getRiskInfo(result.layoff_risk).color}}>
                                                        {getRiskInfo(result.layoff_risk).label}
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={styles.expContainer}>
                                                {result.explanations.map((text, i) => (
                                                    <div key={i} style={{...styles.expItem, borderLeft: `4px solid ${getRiskInfo(result.layoff_risk).color}`}}>
                                                        <Info size={14} color="#3b82f6" style={{flexShrink: 0, marginTop: '2px'}} /> 
                                                        <span>{text}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}

                                   {activeTab === "career" && (
    <motion.div key="career" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
        <h4 style={styles.tabTitle}>Career Strategy</h4>
        
        {/* CASE 1: LOW RISK - Positive Message */}
        {result.layoff_risk <= 30 ? (
            <div style={styles.positiveMsgCard}>
                <div style={{...styles.iconCircle, background: '#dcfce7'}}>
                    <ShieldCheck size={24} color="#166534" />
                </div>
                <h5 style={{margin: '10px 0 5px 0', fontSize: '15px', color: '#1e293b'}}>Your Career is Stable!</h5>
                <p style={{fontSize: '12.5px', color: '#64748b', lineHeight: '1.5', textAlign: 'center'}}>
                    Great news! With a low risk score of <b>{result.layoff_risk}%</b>, your role as <b>{formatWord(form.role)}</b> is currently in a very safe position.
                </p>
                <div style={{...styles.adviceBox, borderLeft: '4px solid #22c55e'}}>
                    <span style={{fontWeight: '700', fontSize: '11px', color: '#166534'}}>💡 RECOMMENDATION:</span>
                    <p style={{margin: '4px 0 0 0', fontSize: '11.5px', color: '#475569'}}>
                        Since you are in a secure spot, use this time to master advanced leadership skills or deep-tech specializations to stay ahead of the curve.
                    </p>
                </div>
            </div>
        ) : (
            /* CASE 2: MEDIUM/HIGH RISK - Suggestions or Trending Message */
            <>
                {careerShifts[form.role] && careerShifts[form.role].length > 0 ? (
                    <>
                        <div style={{...styles.expItem, background: '#fff9eb', border: '1px solid #fde68a', marginBottom: '15px'}}>
                            <ShieldCheck size={16} color="#f59e0b" />
                            <span style={{fontSize: '12px', fontWeight: '500'}}>
                                High potential transitions found based on your skill set.
                            </span>
                        </div>
                        {careerShifts[form.role].map((shift, idx) => {
                            const targetRoleSkills = roleSkills[shift.to] || [];
                            const userSkills = form.skills.split(',').map(s => s.trim().toLowerCase());
                            const haveSkills = targetRoleSkills.filter(s => userSkills.includes(s.toLowerCase()));
                            const missingSkills = targetRoleSkills.filter(s => !userSkills.includes(s.toLowerCase())).slice(0, 4);

                            return (
                                <div key={idx} style={styles.shiftCard}>
                                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                                        <span style={{fontWeight: '700', color: '#1e293b'}}>{shift.to}</span>
                                        <span style={{color: '#22c55e', fontSize: '11px', fontWeight: '800'}}>{shift.match}% Ready</span>
                                    </div>
                                    <div style={{height: '6px', background: '#f1f5f9', borderRadius: '3px', marginBottom: '12px'}}>
                                        <div style={{width: `${shift.match}%`, height: '100%', background: '#22c55e', borderRadius: '3px'}} />
                                    </div>
                                    <div style={styles.skillBox}>
                                        <span style={{fontSize: '10px', color: '#22c55e', fontWeight: '800'}}>✅ HAVE:</span>
                                        <div style={styles.skillTagContainer}>
                                            {haveSkills.length > 0 ? haveSkills.map(s => <span key={s} style={styles.skillTagReady}>{s}</span>) : <span style={{fontSize: '10px', color: '#94a3b8'}}>Analyzing...</span>}
                                        </div>
                                        <div style={{marginTop: '8px'}}>
                                            <span style={{fontSize: '10px', color: '#ef4444', fontWeight: '800'}}>🚀 LEARN:</span>
                                            <div style={styles.skillTagContainer}>
                                                {missingSkills.map(s => <span key={s} style={styles.skillTagMissing}>{s}</span>)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </>
                ) : (
                    /* CASE 3: NO DATA - Trending Role Message */
                    <div style={styles.positiveMsgCard}>
                        <div style={styles.iconCircle}>
                            <Activity size={24} color="#2563eb" />
                        </div>
                        <h5 style={{margin: '10px 0 5px 0', fontSize: '15px', color: '#1e293b'}}>Future-Ready Industry</h5>
                        <p style={{fontSize: '12.5px', color: '#64748b', lineHeight: '1.5', textAlign: 'center'}}>
                            <b>{formatWord(form.role)}</b> is a high-demand trending field. Any current risk is likely due to market volatility, not role obsolescence.
                        </p>
                    </div>
                )}
            </>
        )}
    </motion.div>
)}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

const styles = {
    page: { width: "100vw", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #f0fdf4, #f0f9ff, #eff6ff)", overflow: "hidden", fontFamily: "'Inter', sans-serif" },
    blob: { position: "absolute", width: "400px", height: "400px", borderRadius: "50%", opacity: 0.4, filter: "blur(90px)", zIndex: 1 },
    container: { display: "flex", gap: "25px", zIndex: 5, alignItems: "stretch" },
    card: { background: "rgba(255,255,255,0.96)", padding: "30px", borderRadius: "24px", width: "360px", boxShadow: "0 10px 40px rgba(0,0,0,0.06)", border: "1px solid #fff", display: 'flex', flexDirection: 'column' },
    header: { display: "flex", gap: "12px", marginBottom: "30px" },
    title: { fontSize: "24px", fontWeight: "800", color: "#1e293b", margin: 0, lineHeight: '1.1' },
    titleAi: { color: "#2563eb", fontWeight: "400" },
    subtitle: { fontSize: "12px", color: "#64748b", fontWeight: "500" },
    inputGroup: { position: "relative", marginBottom: "15px" },
    label: { display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: "700", color: "#94a3b8", marginBottom: "6px" },
    input: { width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1.5px solid #f1f5f9", fontSize: "14px", outline: "none", boxSizing: "border-box" },
    suggestBox: { position: "absolute", top: "75px", left: 0, right: 0, background: "white", borderRadius: "12px", boxShadow: "0 10px 20px rgba(0,0,0,0.1)", zIndex: 100, border: "1px solid #f1f5f9", maxHeight: '180px', overflowY: 'auto' },
    suggestItem: { padding: "10px 15px", fontSize: "13px", color: "#475569", cursor: "pointer" },
    activeItem: { padding: "10px 15px", fontSize: "13px", color: "#2563eb", background: "#f0f7ff", cursor: "pointer", fontWeight: "600" },
    button: { width: "100%", padding: "14px", borderRadius: "12px", border: "none", background: "linear-gradient(90deg, #2563eb, #06b6d4, #22c55e)", color: "white", fontWeight: "700", cursor: "pointer", marginTop: '5px' },
    tabHeader: { display: 'flex', gap: '8px', background: '#f1f5f9', padding: '6px', borderRadius: '18px', marginBottom: '20px' },
    tab: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px 5px', border: 'none', background: 'transparent', color: '#64748b', cursor: 'pointer', fontSize: '13px', fontWeight: '600', borderRadius: '12px' },
    activeTab: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px 5px', border: 'none', background: '#fff', color: '#2563eb', cursor: 'pointer', fontSize: '13px', fontWeight: '700', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
    gaugeArea: { position: "relative", display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '20px', marginBottom: '10px' },
    riskScoreContainer: { position: 'absolute', top: '65px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' },
    riskScore: { fontSize: "44px", fontWeight: "900", color: "#1e293b", lineHeight: '0.8', margin: 0 },
    riskLevelLabel: { fontSize: "12px", fontWeight: "800", letterSpacing: '1.5px', marginTop: '8px', textTransform: 'uppercase' },
    shiftCard: { background: "#fff", border: "1px solid #f1f5f9", borderRadius: "12px", padding: "15px", marginBottom: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" },
    expContainer: { marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px", maxHeight: '230px', overflowY: 'auto' },
    expItem: { display: "flex", gap: "10px", background: "#f8fafc", padding: "12px", borderRadius: "12px", fontSize: "12.5px", color: "#475569", border: "1px solid #f1f5f9", lineHeight: '1.4' },
    tabTitle: { color: '#1e293b', marginBottom: '15px', fontSize: '16px', fontWeight: '700' },
    skillBox: {
    background: '#f8fafc',
    padding: '10px',
    borderRadius: '10px',
    border: '1px solid #f1f5f9'
},
skillTagContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '5px',
    marginTop: '6px'
},
skillTagReady: {
    fontSize: '10px',
    background: '#dcfce7',
    color: '#166534',
    padding: '2px 8px',
    borderRadius: '6px',
    fontWeight: '600'
},
skillTagMissing: {
    fontSize: '10px',
    background: '#fee2e2',
    color: '#991b1b',
    padding: '2px 8px',
    borderRadius: '6px',
    fontWeight: '600'
},
positiveMsgCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '30px 20px',
    background: 'linear-gradient(to bottom, #f0f9ff, #ffffff)',
    borderRadius: '20px',
    border: '1px dashed #bae6fd',
    marginTop: '10px'
},
iconCircle: {
    width: '50px',
    height: '50px',
    borderRadius: '25px',
    background: '#e0f2fe',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '10px'
},
adviceBox: {
    marginTop: '20px',
    padding: '12px',
    background: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    width: '100%'
},
};