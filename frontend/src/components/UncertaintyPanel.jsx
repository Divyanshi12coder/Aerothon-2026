// UncertaintyPanel.jsx – Confidence bounds visualization
import React from 'react';
import { TbChartAreaLine } from 'react-icons/tb';

function UncertaintyRow({ label, data }) {
  if (!data) return null;
  const { lower_bound, upper_bound, confidence_percent } = data;
  const range = upper_bound - lower_bound;
  // Map to visual bar: position on 0.7–1.0 range
  const barMin = 0.70;
  const barMax = 1.00;
  const leftPct  = ((lower_bound - barMin) / (barMax - barMin)) * 100;
  const widthPct = (range / (barMax - barMin)) * 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>{label}</span>
        <span
          className="mono"
          style={{
            fontSize: '10px',
            fontWeight: 700,
            color: confidence_percent >= 97 ? 'var(--healthy)' : 'var(--warning)',
            background: confidence_percent >= 97 ? 'var(--healthy-bg)' : 'var(--warning-bg)',
            padding: '2px 7px',
            borderRadius: '4px',
          }}
        >
          {confidence_percent.toFixed(1)}%
        </span>
      </div>

      {/* Visual confidence bar */}
      <div style={{ position: 'relative', height: '20px', background: 'var(--bg-surface-2)', borderRadius: '4px', border: '1px solid var(--border-light)' }}>
        {/* Range bar */}
        <div
          style={{
            position: 'absolute',
            top: '3px',
            left: `${Math.max(0, leftPct)}%`,
            width: `${Math.min(widthPct, 100 - leftPct)}%`,
            height: '14px',
            background: 'rgba(46,109,164,0.25)',
            border: '1px solid rgba(46,109,164,0.4)',
            borderRadius: '3px',
            transition: 'all 0.5s ease',
          }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span className="mono" style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
          ↓ {lower_bound.toFixed(4)}
        </span>
        <span className="mono" style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
          ↑ {upper_bound.toFixed(4)}
        </span>
      </div>
    </div>
  );
}

export default function UncertaintyPanel({ uncertainty }) {
  if (!uncertainty) return null;

  return (
    <div className="panel animate-fadeIn">
      <div className="panel-header">
        <TbChartAreaLine size={14} style={{ color: 'var(--steel)' }} />
        <span className="panel-title">Uncertainty Bounds</span>
      </div>
      <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <UncertaintyRow label="Compressor Health" data={uncertainty.CompressorHealth} />
        <UncertaintyRow label="Combustor Health"  data={uncertainty.CombustorHealth} />
        <UncertaintyRow label="Overall Health"    data={uncertainty.OverallHealth} />
        <div style={{ fontSize: '10px', color: 'var(--text-muted)', borderTop: '1px solid var(--border-light)', paddingTop: '8px' }}>
          Monte Carlo dropout uncertainty — 95% credible interval
        </div>
      </div>
    </div>
  );
}
