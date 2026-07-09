// MaintenancePanel.jsx – Maintenance recommendation panel
import React from 'react';
import { TbTool, TbClipboardCheck } from 'react-icons/tb';

const PRIORITY_STYLE = {
  Low:    { color: 'var(--healthy)', bg: 'var(--healthy-bg)' },
  Medium: { color: 'var(--warning)', bg: 'var(--warning-bg)' },
  High:   { color: 'var(--critical)', bg: 'var(--critical-bg)' },
};

export default function MaintenancePanel({ maintenance }) {
  if (!maintenance) return null;

  const { action, priority, inspection_required, recommendations } = maintenance;
  const style = PRIORITY_STYLE[priority] || PRIORITY_STYLE.Medium;

  return (
    <div className="panel animate-fadeIn">
      <div className="panel-header">
        <TbTool size={14} style={{ color: 'var(--steel)' }} />
        <span className="panel-title">Maintenance</span>
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
            letterSpacing: '0.06em',
          }}
        >
          {priority} PRIORITY
        </span>
      </div>

      <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Action */}
        <div>
          <div className="section-label" style={{ fontSize: '9px', marginBottom: '4px' }}>Recommended Action</div>
          <p style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.5 }}>
            {action}
          </p>
        </div>

        {/* Inspection badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TbClipboardCheck size={14} style={{ color: inspection_required ? 'var(--warning)' : 'var(--healthy)' }} />
          <span style={{ fontSize: '11px', fontWeight: 500, color: inspection_required ? 'var(--warning)' : 'var(--healthy)' }}>
            Inspection {inspection_required ? 'Required' : 'Not Required'}
          </span>
        </div>

        {/* Recommendations */}
        {recommendations && recommendations.length > 0 && (
          <div>
            <div className="section-label" style={{ fontSize: '9px', marginBottom: '6px' }}>Recommendations</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {recommendations.map((rec, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--steel)', flexShrink: 0, fontWeight: 700, marginTop: '1px' }}>›</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
