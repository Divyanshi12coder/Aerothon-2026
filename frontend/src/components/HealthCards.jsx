// HealthCards.jsx – Compressor, Combustor, Turbine health cards
import React from 'react';
import { TbWind, TbFlame, TbEngine } from 'react-icons/tb';

function getStatus(val) {
  if (val === null || val === undefined) return { label: 'NO DATA', color: '#9CA3AF', bg: '#F3F4F6', border: '#E5E7EB' };
  if (val >= 0.90) return { label: 'HEALTHY',  color: '#1A7A4A', bg: '#E8F5EE', border: '#D1EAD8' };
  if (val >= 0.80) return { label: 'WARNING',  color: '#B45309', bg: '#FEF3C7', border: '#FDE68A' };
  return              { label: 'CRITICAL', color: '#B91C1C', bg: '#FEE2E2', border: '#FECACA' };
}

function HealthBar({ value }) {
  const pct = value !== null && value !== undefined ? value * 100 : 0;
  const { color } = getStatus(value);
  return (
    <div className="progress-bar" style={{ marginTop: '8px' }}>
      <div
        className="progress-fill"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}

function HealthCard({ icon: Icon, label, value }) {
  const status = getStatus(value);
  const pct = value !== null && value !== undefined ? (value * 100).toFixed(1) : null;

  return (
    <div
      className="panel"
      style={{
        borderTop: `3px solid ${status.color}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        padding: '14px 14px 12px',
        transition: 'border-color 0.4s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Icon size={14} style={{ color: status.color }} />
          <span className="panel-title">{label}</span>
        </div>
        <span
          style={{
            fontSize: '9px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            padding: '2px 7px',
            borderRadius: '4px',
            background: status.bg,
            color: status.color,
            border: `1px solid ${status.border}`,
            fontFamily: 'var(--font-mono)',
          }}
        >
          {status.label}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '6px' }}>
        <span
          className="mono"
          style={{ fontSize: '26px', fontWeight: 700, color: status.color, lineHeight: 1 }}
        >
          {pct ?? '—'}
        </span>
        {pct !== null && (
          <span style={{ fontSize: '14px', color: status.color, fontWeight: 500 }}>%</span>
        )}
      </div>

      <HealthBar value={value} />

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
        <span style={{ fontSize: '9px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          {value !== null && value !== undefined ? value.toFixed(4) : 'N/A'} index
        </span>
        <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
          Threshold: ≥0.90 ✓
        </span>
      </div>
    </div>
  );
}

export default function HealthCards({ predictions }) {
  return (
    <div className="health-row">
      <HealthCard
        icon={TbWind}
        label="Compressor"
        value={predictions?.CompressorHealth ?? null}
      />
      <HealthCard
        icon={TbFlame}
        label="Combustor"
        value={predictions?.CombustorHealth ?? null}
      />
      <HealthCard
        icon={TbEngine}
        label="Turbine"
        value={predictions?.TurbineHealth ?? null}
      />
    </div>
  );
}
