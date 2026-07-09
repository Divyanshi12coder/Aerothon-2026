// VirtualSensors.jsx – Virtual sensor readings grid
import React from 'react';
import { TbCpu, TbWind, TbFlame, TbEngine, TbRocket, TbDroplet } from 'react-icons/tb';

const SENSOR_META = {
  'Compressor Health Sensor':       { icon: TbWind,   unit: 'idx', format: v => v.toFixed(4) },
  'Combustor Health Sensor':        { icon: TbFlame,  unit: 'idx', format: v => v.toFixed(4) },
  'Turbine Health Sensor':          { icon: TbEngine, unit: 'idx', format: v => v.toFixed(4) },
  'Overall Engine Health Sensor':   { icon: TbCpu,    unit: 'idx', format: v => v.toFixed(4) },
  'Estimated Thrust Sensor':        { icon: TbRocket, unit: 'N',   format: v => v.toLocaleString('en-US', { maximumFractionDigits: 0 }) },
  'Estimated TSFC Sensor':          { icon: TbDroplet,unit: 'g/N·s', format: v => v.toFixed(4) },
};

function SensorRow({ name, value }) {
  const meta = SENSOR_META[name] || { icon: TbCpu, unit: '', format: v => String(v) };
  const IconComp = meta.icon;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '7px 0',
        borderBottom: '1px solid var(--border-light)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
        <IconComp size={12} style={{ color: 'var(--steel)', flexShrink: 0 }} />
        <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500 }}>
          {name.replace(' Sensor', '')}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
        <span className="mono" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
          {meta.format(value)}
        </span>
        <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{meta.unit}</span>
      </div>
    </div>
  );
}

export default function VirtualSensors({ virtualSensors }) {
  if (!virtualSensors) return null;

  const entries = Object.entries(virtualSensors);

  return (
    <div className="panel animate-fadeIn">
      <div className="panel-header">
        <TbCpu size={14} style={{ color: 'var(--steel)' }} />
        <span className="panel-title">Virtual Sensors</span>
        <span style={{ marginLeft: 'auto', fontSize: '9px', color: 'var(--healthy)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
          {entries.length} ACTIVE
        </span>
      </div>
      <div style={{ padding: '4px 16px 12px' }}>
        {entries.map(([name, value]) => (
          <SensorRow key={name} name={name} value={value} />
        ))}
      </div>
    </div>
  );
}
