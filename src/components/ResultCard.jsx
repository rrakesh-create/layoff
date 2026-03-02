export default function ResultCard({ result }) {

  if (!result) return null;

  const getColor = () => {
    if (result.risk_level === "Low")
      return "#22c55e";
    if (result.risk_level === "Medium")
      return "#facc15";
    return "#ef4444";
  };

  const cardStyle = {
    marginTop: "20px",
    background: "#0f172a",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.3)"
  };

  return (
    <div style={cardStyle}>
      <h3>Layoff Risk</h3>

      <h1>{result.layoff_risk}%</h1>

      <h2 style={{color:getColor()}}>
        {result.risk_level} Risk
      </h2>
    </div>
  );
}