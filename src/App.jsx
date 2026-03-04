import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";
import InputForm from "./components/InputForm";
import ResultCard from "./components/ResultCard";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import * as Lucide from 'lucide-react';

function Analyzer() {
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "linear-gradient(120deg,#f8fafc,#e0f2fe,#bae6fd)",
    fontFamily: "'Inter', sans-serif",
  };

  return (
    <div style={containerStyle}>
      <nav style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => navigate("/")}>
          <Lucide.ShieldCheck color="#2563eb" size={24} />
          <span style={{ fontWeight: '800', fontSize: '18px', color: '#1e293b' }}>RiskGuard AI</span>
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
            background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px',
            fontSize: '14px', fontWeight: 'bold', color: '#2563eb', cursor: 'pointer',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
          }}
        >
          <Lucide.LayoutDashboard size={18} /> Market Insights
        </button>
      </nav>

      <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", gap: "40px" }}>
        <InputForm setResult={setResult} />
        {/* ResultCard is now integrated inside InputForm in some versions, but keeping it for compatibility if needed */}
        {/* <ResultCard result={result} /> */}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/analyzer" element={<Analyzer />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;