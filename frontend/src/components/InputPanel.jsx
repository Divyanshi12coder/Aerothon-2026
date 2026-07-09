// InputPanel.jsx – Grouped sensor input form
import React from 'react';
import { TbPlane, TbEngine, TbThermometer, TbPlayerPlay, TbLoader2 } from 'react-icons/tb';

const FLIGHT_CONDITIONS = [
  { key: 'Cycle',        label: 'Cycle',        unit: '',    step: 1    },
  { key: 'Altitude_m',   label: 'Altitude',     unit: 'm',   step: 100  },
  { key: 'Mach',         label: 'Mach Number',  unit: '',    step: 0.01 },
  { key: 'Tamb_K',       label: 'T Ambient',    unit: 'K',   step: 1    },
  { key: 'Pamb_Pa',      label: 'P Ambient',    unit: 'Pa',  step: 1000 },
];

const ENGINE_CONDITIONS = [
  { key: 'RPM_rev_min',  label: 'RPM',          unit: 'rpm', step: 1000 },
  { key: 'FuelFlow_kg_s',label: 'Fuel Flow',    unit: 'kg/s',step: 0.1  },
];

const SENSOR_CONDITIONS = [
  { key: 'P2_Pa',        label: 'P2 Compressor In',  unit: 'Pa', step: 1000 },
  { key: 'T2_K',         label: 'T2 Compressor In',  unit: 'K',  step: 5    },
  { key: 'P3_Pa',        label: 'P3 Combustor In',   unit: 'Pa', step: 1000 },
  { key: 'T3_K',         label: 'T3 Combustor In',   unit: 'K',  step: 10   },
  { key: 'P4_Pa',        label: 'P4 Turbine In',     unit: 'Pa', step: 1000 },
  { key: 'T4_K',         label: 'T4 Turbine In',     unit: 'K',  step: 10   },
];

function FieldGroup({ title, icon: Icon, fields, values, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div className="section-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {Icon && <Icon size={12} />}
        {title}
      </div>
      {fields.map(({ key, label, unit, step }) => (
        <div key={key} className="form-group">
          <label className="form-label" htmlFor={`input-${key}`}>
            {label} {unit && <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({unit})</span>}
          </label>
          <input
            id={`input-${key}`}
            type="number"
            className="form-input"
            name={key}
            value={values[key]}
            step={step}
            onChange={onChange}
          />
        </div>
      ))}
    </div>
  );
}

export default function InputPanel({ values, onChange, onPredict, loading, error }) {
  return (
    <div className="panel" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div className="panel-header">
        <TbEngine size={14} style={{ color: 'var(--steel)' }} />
        <span className="panel-title">Sensor Input Parameters</span>
      </div>

      {/* Body */}
      <div
        className="panel-body"
        style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}
      >
        <FieldGroup
          title="Flight Conditions"
          icon={TbPlane}
          fields={FLIGHT_CONDITIONS}
          values={values}
          onChange={onChange}
        />
        <div className="divider" />
        <FieldGroup
          title="Engine Operating"
          icon={TbEngine}
          fields={ENGINE_CONDITIONS}
          values={values}
          onChange={onChange}
        />
        <div className="divider" />
        <FieldGroup
          title="Pressure / Temperature Sensors"
          icon={TbThermometer}
          fields={SENSOR_CONDITIONS}
          values={values}
          onChange={onChange}
        />

        {/* Error message */}
        {error && (
          <div className="error-banner">
            <span>⚠</span>
            <span>{error}</span>
          </div>
        )}

        {/* Predict button */}
        <button
          id="predict-btn"
          className="btn-primary"
          onClick={onPredict}
          disabled={loading}
          style={{ marginTop: '4px' }}
        >
          {loading ? (
            <>
              <TbLoader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
              Running Prediction…
            </>
          ) : (
            <>
              <TbPlayerPlay size={16} />
              Run Digital Twin
            </>
          )}
        </button>

        <div style={{ fontSize: '10px', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.5 }}>
          POST → http://127.0.0.1:8000/predict
        </div>
      </div>
    </div>
  );
}
