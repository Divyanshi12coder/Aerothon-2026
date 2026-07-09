// HealthGauge.jsx – Overall engine health arc gauge
import React from 'react';
import GaugeComponent from 'react-gauge-component';

function getStatusLabel(val) {
  if (val === null || val === undefined) return '—';
  if (val >= 0.90) return 'HEALTHY';
  if (val >= 0.80) return 'WARNING';
  return 'CRITICAL';
}

function getStatusColor(val) {
  if (val === null || val === undefined) return '#9CA3AF';
  if (val >= 0.90) return '#1A7A4A';
  if (val >= 0.80) return '#B45309';
  return '#B91C1C';
}

export default function HealthGauge({ value }) {
  const pct = value !== null && value !== undefined ? Math.round(value * 100) : null;
  const color = getStatusColor(value);
  const label = getStatusLabel(value);

  return (
    <div className="panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="panel-header" style={{ width: '100%' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--steel)" strokeWidth="2">
          <path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 6v6l4 2"/>
        </svg>
        <span className="panel-title">Overall Engine Health</span>
      </div>

      <div style={{ width: '100%', padding: '8px 16px 0' }}>
        {pct !== null ? (
          <GaugeComponent
            type="semicircle"
            arc={{
              width: 0.18,
              padding: 0.02,
              cornerRadius: 4,
              subArcs: [
                { limit: 80, color: '#EF4444', showTick: true },
                { limit: 90, color: '#F59E0B', showTick: true },
                { limit: 100, color: '#22C55E', showTick: false },
              ],
            }}
            pointer={{
              color: '#1C3A5C',
              length: 0.70,
              width: 14,
              elastic: true,
            }}
            labels={{
              valueLabel: {
                formatTextValue: v => `${v}%`,
                style: {
                  fontSize: '28px',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: '700',
                  fill: color,
                },
              },
              tickLabels: {
                type: 'outer',
                ticks: [
                  { value: 0 },
                  { value: 50 },
                  { value: 80 },
                  { value: 90 },
                  { value: 100 },
                ],
                defaultTickValueConfig: {
                  formatTextValue: v => `${v}`,
                  style: { fontSize: '9px', fill: '#8A9AB0', fontFamily: 'monospace' },
                },
              },
            }}
            value={pct}
            minValue={0}
            maxValue={100}
          />
        ) : (
          <div style={{ height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No data</span>
          </div>
        )}
      </div>

      {/* Status label */}
      <div
        style={{
          marginBottom: '16px',
          padding: '4px 16px',
          borderRadius: '100px',
          background: pct !== null ? (value >= 0.90 ? 'var(--healthy-bg)' : value >= 0.80 ? 'var(--warning-bg)' : 'var(--critical-bg)') : 'var(--bg-surface-2)',
          color,
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.1em',
          fontFamily: 'var(--font-mono)',
        }}
      >
        {label}
      </div>
    </div>
  );
}
