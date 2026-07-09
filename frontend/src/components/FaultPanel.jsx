// FaultPanel.jsx – Fault diagnosis display
import React from 'react';
import { TbAlertTriangle, TbCircleCheck, TbShieldX } from 'react-icons/tb';

const SEVERITY_STYLE = {
  None:   { color: 'var(--healthy)', bg: 'var(--healthy-bg)', icon: TbCircleCheck },
  Low:    { color: 'var(--healthy)', bg: 'var(--healthy-bg)', icon: TbCircleCheck },
  Medium: { color: 'var(--warning)', bg: 'var(--warning-bg)', icon: TbAlertTriangle },
  High:   { color: 'var(--critical)', bg: 'var(--critical-bg)', icon: TbShieldX },
};

export default function FaultPanel({ faultDiagnosis }) {
  if (!faultDiagnosis) return null;

  const { fault, severity, affected_systems } = faultDiagnosis;
  const style = SEVERITY_STYLE[severity] || SEVERITY_STYLE.Medium;
  const IconComp = style.icon;

  return (
    <div className="panel animate-fadeIn">
      <div className="panel-header">
        <TbAlertTriangle size={14} style={{ color: 'var(--steel)' }} />
        <span className="panel-title">Fault Diagnosis</span>
      </div>
      <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Fault */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            padding: '10px',
            background: style.bg,
            borderRadius: 'var(--radius-md)',
            border: `1px solid ${style.color}30`,
          }}
        >
          <IconComp size={18} style={{ color: style.color, flexShrink: 0, marginTop: '1px' }} />
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: style.color }}>{fault}</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Severity: <span style={{ color: style.color, fontWeight: 600 }}>{severity}</span>
            </div>
          </div>
        </div>

        {/* Affected systems */}
        <div>
          <div className="section-label" style={{ fontSize: '9px', marginBottom: '6px' }}>Affected Systems</div>
          {affected_systems && affected_systems.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {affected_systems.map((sys, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: '10px',
                    padding: '2px 8px',
                    background: 'var(--critical-bg)',
                    color: 'var(--critical)',
                    borderRadius: '4px',
                    fontWeight: 600,
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {sys}
                </span>
              ))}
            </div>
          ) : (
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>None identified</span>
          )}
        </div>
      </div>
    </div>
  );
}
