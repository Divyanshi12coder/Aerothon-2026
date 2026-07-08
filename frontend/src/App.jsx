import { useState } from "react";
import api from "./services/api";
import "./App.css";

function App() {
  const [input, setInput] = useState({
    Cycle: 20,
    Altitude_m: 5000,
    Mach: 0.5,
    Tamb_K: 250,
    Pamb_Pa: 54000,
    RPM_rev_min: 60000,
    FuelFlow_kg_s: 1.2,
    P2_Pa: 220000,
    T2_K: 420,
    P3_Pa: 210000,
    T3_K: 1100,
    P4_Pa: 90000,
    T4_K: 750,
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: Number(e.target.value),
    });
  };

  const handlePredict = async () => {
    const res = await api.post("/predict", input);
    setResult(res.data);
  };

  return (
    <div className="app">
      <h1>Turbojet Digital Twin</h1>

      <div className="grid">
        <div className="card">
          <h2>Sensor Input</h2>

          {Object.keys(input).map((key) => (
            <label key={key}>
              {key}
              <input
                type="number"
                name={key}
                value={input[key]}
                onChange={handleChange}
              />
            </label>
          ))}

          <button onClick={handlePredict}>Run Prediction</button>
        </div>

        <div className="card">
          <h2>Digital Twin Output</h2>

          {!result && <p>No prediction yet.</p>}

          {result && (
            <>
              <h3>Status: {result.engine_status}</h3>

              {Object.entries(result.predictions).map(([key, value]) => (
                <p key={key}>
                  <strong>{key}:</strong>{" "}
                  {typeof value === "number" ? value.toFixed(4) : value}
                </p>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;