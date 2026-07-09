// Header.jsx – AeroTwin dashboard header
import React from 'react';
import { TbPropeller, TbWifi, TbWifiOff } from 'react-icons/tb';
import StatusBadge from './StatusBadge';

export default function Header({ engineStatus, isOnline }) {
  return (
    <header
      style={{
        background: 'var(--bg-header)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '56px',
        flexShrink: 0,
      }}
    >
      {/* Left: Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <TbPropeller size={20} style={{ color: '#90C8F0' }} />
        </div>
        <div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.3px' }}>
            AeroTwin
          </div>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.55)', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Physics-Informed Four-Stage Turbojet Digital Twin
          </div>
        </div>
      </div>

      {/* Center: dividers */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Model</div>
          <div style={{ fontSize: '11px', color: '#90C8F0', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>PI-PINN v1.0</div>
        </div>
        <div style={{ width: '1px', height: '28px', background: 'rgba(255,255,255,0.1)' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Engine</div>
          <div style={{ fontSize: '11px', color: '#90C8F0', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>J-85 Sim</div>
        </div>
        <div style={{ width: '1px', height: '28px', background: 'rgba(255,255,255,0.1)' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Stages</div>
          <div style={{ fontSize: '11px', color: '#90C8F0', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>4-Stage</div>
        </div>
      </div>

      {/* Right: Status + connectivity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {engineStatus && <StatusBadge status={engineStatus} />}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '11px',
            color: isOnline ? '#4ADE80' : '#F87171',
            fontWeight: 500,
          }}
        >
          {isOnline
            ? <TbWifi size={14} />
            : <TbWifiOff size={14} />
          }
          {isOnline ? 'Backend Online' : 'Offline'}
        </div>
      </div>
    </header>
  );
}
