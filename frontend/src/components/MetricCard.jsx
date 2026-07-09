// MetricCard.jsx – Reusable single-metric display card
import React from 'react';

export default function MetricCard({ icon: Icon, label, value, unit, sub, accent = false }) {
  return (
    <div
      className="panel"
      style={{
        padding: '14px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        borderLeft: accent ? `3px solid var(--steel)` : undefined,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {Icon && <Icon size={14} style={{ color: 'var(--steel)' }} />}
        <span className="panel-title">{label}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
        <span
          className="mono"
          style={{ fontSize: '22px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}
        >
          {value ?? '—'}
        </span>
        {unit && (
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>
            {unit}
          </span>
        )}
      </div>
      {sub && (
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{sub}</span>
      )}
    </div>
  );
}
