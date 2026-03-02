 import { useState } from "react";
import axios from "axios";

export default function InputForm({ setResult }) {

  const [form, setForm] = useState({
    skills: "",
    role: "",
    experience_level: "",
    years_experience: 1
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await axios.post(
      "http://127.0.0.1:8000/predict",
      form
    );

    setResult(res.data);
  };

const cardStyle = {
  background: "rgba(255,255,255,0.9)",
  backdropFilter: "blur(10px)",
  padding: "30px",
  borderRadius: "14px",
  width: "420px",
  boxShadow: "0 10px 40px rgba(0,0,0,0.2)"
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "1px solid #cbd5e1",
  color: "#111",
};

const buttonStyle = {
  width: "100%",
  padding: "13px",
  border: "none",
  borderRadius: "8px",
  background:
    "linear-gradient(90deg,#2563eb,#06b6d4,#22c55e)",
  color: "white",
  fontWeight: "bold",
  fontSize: "16px",
  cursor: "pointer",
};

  return (
    <form style={cardStyle} onSubmit={handleSubmit}>

      <h2 style={{textAlign:"center"}}>
        Layoff Risk Predictor
      </h2>

      <input
        style={inputStyle}
        name="skills"
        placeholder="Enter Skills"
        onChange={handleChange}
        required
      />

      <select
        style={inputStyle}
        name="role"
        onChange={handleChange}
        required
      >
        <option value="">Select Role</option>
        <option>Frontend Developer</option>
        <option>Backend Developer</option>
        <option>Full Stack Developer</option>
        <option>ML Engineer</option>
        <option>DevOps Engineer</option>
        <option>Cybersecurity Engineer</option>
      </select>

      <select
        style={inputStyle}
        name="experience_level"
        onChange={handleChange}
        required
      >
        <option value="">Experience Level</option>
        <option>junior</option>
        <option>mid</option>
        <option>senior</option>
      </select>

      <input
        style={inputStyle}
        type="number"
        name="years_experience"
        min="0"
        placeholder="Years Experience"
        onChange={handleChange}
      />

      <button style={buttonStyle}>
        Predict Risk
      </button>

    </form>
  );
}