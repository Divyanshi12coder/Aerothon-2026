// RULPanel.jsx – Remaining Useful Life panel
import React from 'react';
import { TbHourglass, TbActivity } from 'react-icons/tb';

const CONDITION_STYLE = {
  Excellent: { color: 'var(--healthy)', bg: 'var(--healthy-bg)' },
  Good:      { color: '#0E7490',        bg: '#ECFEFF'           },
  Fair:      { color: 'var(--warning)', bg: 'var(--warning-bg)' },
  Poor:      { color: 'var(--critical)',bg: 'var(--critical-bg)' },
};

export default function RULPanel({ rul }) {
  if (!rul) return null;

  const { remaining_cycles, estimated_total_life, condition } = rul;
  const style = CONDITION_STYLE[condition] || CONDITION_STYLE.Fair;
  const progressPct = estimated_total_life > 0
    ? Math.max(0, Math.min(100, (remaining_cycles / estimated_total_life) * 100))
    : 0;

  return (
    <div className="panel animate-fadeIn">
      <div className="panel-header">
        <TbHourglass size={14} style={{ color: 'var(--steel)' }} />
        <span className="panel-title">Remaining Useful Life</span>
        <span
          style={{
            marginLeft: 'auto',
            fontSize: '9px',
            fontWeight: 700,
            padding: '2px 7px',
            borderRadius: '4px',
            background: style.bg,
            color: style.color,
            fontFamily: 'var(--font-mono)',
          }}
        >
          {condition}
        </span>
      </div>

      <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Main stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ padding: '10px', background: 'var(--bg-surface-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
              Remaining
            </div>
            <div className="mono" style={{ fontSize: '22px', fontWeight: 700, color: style.color }}>
              {remaining_cycles.toLocaleString()}
            </div>
            <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>cycles</div>
          </div>
          <div style={{ padding: '10px', background: 'var(--bg-surface-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
              Total Life
            </div>
            <div className="mono" style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {estimated_total_life.toLocaleString()}
            </div>
            <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>cycles</div>
          </div>
        </div>

        {/* RUL Progress */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 500 }}>Life Remaining</span>
            <span className="mono" style={{ fontSize: '10px', color: style.color, fontWeight: 700 }}>
              {progressPct.toFixed(1)}%
            </span>
          </div>
          <div className="progress-bar" style={{ height: '10px' }}>
            <div
              className="progress-fill"
              style={{
                width: `${progressPct}%`,
                background: `linear-gradient(90deg, ${style.color}CC, ${style.color})`,
              }}
            />
          </div>
        </div>

        {/* Icon row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: 'var(--text-muted)' }}>
          <TbActivity size={12} />
          Used {(estimated_total_life - remaining_cycles).toLocaleString()} of {estimated_total_life.toLocaleString()} cycles
        </div>
      </div>
    </div>
  );
}
