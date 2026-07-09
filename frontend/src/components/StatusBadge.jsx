// StatusBadge.jsx – Engine status indicator pill
import React from 'react';
import { TbCircleFilled } from 'react-icons/tb';

const CONFIG = {
  Healthy:  { color: 'var(--healthy)',  bg: 'var(--healthy-bg)',  border: 'var(--healthy-light)' },
  Warning:  { color: 'var(--warning)',  bg: 'var(--warning-bg)',  border: 'var(--warning-light)' },
  Critical: { color: 'var(--critical)', bg: 'var(--critical-bg)', border: 'var(--critical-light)' },
};

export default function StatusBadge({ status }) {
  const cfg = CONFIG[status] || CONFIG.Warning;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 12px',
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        borderRadius: '100px',
        color: cfg.color,
        fontSize: '12px',
        fontWeight: 600,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
      }}
    >
      <TbCircleFilled size={8} style={{ color: cfg.color }} />
      {status || 'Unknown'}
    </div>
  );
}
