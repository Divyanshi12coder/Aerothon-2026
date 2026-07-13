// App.jsx – AeroTwin Digital Twin Dashboard Orchestrator

import { useState, useCallback, useEffect } from 'react';
import { predict, checkHealth } from './services/api';

import Header from './components/Header';
import InputPanel from './components/InputPanel';
import EngineSchematic from './components/EngineSchematic';
import HealthGauge from './components/HealthGauge';
import HealthCards from './components/HealthCards';
import PerformanceCards from './components/PerformanceCards';
import UncertaintyPanel from './components/UncertaintyPanel';
import FaultPanel from './components/FaultPanel';
import MaintenancePanel from './components/MaintenancePanel';
import RULPanel from './components/RULPanel';
import VirtualSensors from './components/VirtualSensors';
import TrendChart from './components/TrendChart';

import './index.css';
import './App.css';

const DEFAULT_INPUT = {
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
};

function EmptyCenter() {
  return (
    <div
      className="panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px',
        gap: '16px',
      }}
    >
      <svg width="80" height="40" viewBox="0 0 200 60" fill="none">
        <rect
          x="10"
          y="20"
          width="40"
          height="20"
          rx="4"
          fill="#EAF2FB"
          stroke="#2E6DA4"
          strokeWidth="1.5"
        />

        <rect
          x="70"
          y="10"
          width="60"
          height="40"
          rx="6"
          fill="#EAF2FB"
          stroke="#2E6DA4"
          strokeWidth="1.5"
        />

        <rect
          x="150"
          y="20"
          width="40"
          height="20"
          rx="4"
          fill="#EAF2FB"
          stroke="#2E6DA4"
          strokeWidth="1.5"
        />

        <line
          x1="50"
          y1="30"
          x2="70"
          y2="30"
          stroke="#2E6DA4"
          strokeWidth="1.5"
          strokeDasharray="3 2"
        />

        <line
          x1="130"
          y1="30"
          x2="150"
          y2="30"
          stroke="#2E6DA4"
          strokeWidth="1.5"
          strokeDasharray="3 2"
        />

        <text
          x="100"
          y="35"
          textAnchor="middle"
          fill="#2E6DA4"
          fontSize="9"
          fontFamily="monospace"
          fontWeight="600"
        >
          ENGINE
        </text>
      </svg>

      <p
        style={{
          fontSize: '13px',
          color: 'var(--text-muted)',
          textAlign: 'center',
          maxWidth: '280px',
          lineHeight: 1.6,
        }}
      >
        Configure sensor parameters in the input panel and run the digital
        twin prediction to see live engine health data.
      </p>
    </div>
  );
}

function EmptyRight() {
  return (
    <div
      className="panel"
      style={{
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
      }}
    >
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'var(--bg-surface-2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--border)"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
      </div>

      <p
        style={{
          fontSize: '11px',
          color: 'var(--text-muted)',
          textAlign: 'center',
          lineHeight: 1.5,
        }}
      >
        Advanced diagnostics will appear after first prediction
      </p>
    </div>
  );
}

export default function App() {
  const [input, setInput] = useState(DEFAULT_INPUT);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const verifyBackend = async () => {
      try {
        const data = await checkHealth();

        if (isMounted) {
          setIsOnline(data?.status === 'online');
        }
      } catch {
        if (isMounted) {
          setIsOnline(false);
        }
      }
    };

    verifyBackend();

    const intervalId = setInterval(verifyBackend, 10000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;

    setInput((previousInput) => ({
      ...previousInput,
      [name]: Number(value),
    }));
  }, []);

  const handlePredict = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await predict(input);

      setResult(data);
      setHistory((previousHistory) => [...previousHistory, data]);
      setIsOnline(true);
    } catch (err) {
      const isNetworkError =
        err?.code === 'ECONNREFUSED' ||
        err?.code === 'ERR_NETWORK' ||
        !err?.response;

      const message = isNetworkError
        ? 'Backend offline — start the FastAPI server at http://127.0.0.1:8000'
        : err?.response?.data?.detail ||
          err?.message ||
          'Prediction failed';

      setError(message);
      setIsOnline(false);
    } finally {
      setLoading(false);
    }
  }, [input]);

  const predictions = result?.predictions ?? null;

  return (
    <div className="app-shell">
      <Header
        engineStatus={result?.engine_status ?? null}
        isOnline={isOnline}
      />

      <main className="dashboard-body">
        <aside className="col-left">
          <InputPanel
            values={input}
            onChange={handleChange}
            onPredict={handlePredict}
            loading={loading}
            error={error}
          />
        </aside>

        <section className="col-center">
          <EngineSchematic predictions={predictions} />

          {predictions ? (
            <>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1.6fr',
                  gap: '10px',
                  alignItems: 'start',
                }}
              >
                <HealthGauge value={predictions.OverallHealth} />

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  <HealthCards predictions={predictions} />
                </div>
              </div>

              <PerformanceCards predictions={predictions} />
            </>
          ) : (
            <EmptyCenter />
          )}
        </section>

        <aside className="col-right">
          {result ? (
            <>
              <UncertaintyPanel uncertainty={result.uncertainty} />

              <FaultPanel faultDiagnosis={result.fault_diagnosis} />

              <MaintenancePanel maintenance={result.maintenance} />

              <RULPanel rul={result.remaining_useful_life} />

              <VirtualSensors virtualSensors={result.virtual_sensors} />
            </>
          ) : (
            <EmptyRight />
          )}
        </aside>

        <section className="col-bottom">
          <TrendChart history={history} />
        </section>
      </main>
    </div>
  );
}