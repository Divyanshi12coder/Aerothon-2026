// PerformanceCards.jsx – Thrust and TSFC metric cards
import React from 'react';
import { TbRocket, TbDroplet } from 'react-icons/tb';
import MetricCard from './MetricCard';

export default function PerformanceCards({ predictions }) {
  const thrust = predictions?.Thrust_N;
  const tsfc   = predictions?.TSFC_g_N_s;

  return (
    <div className="perf-row">
      <MetricCard
        icon={TbRocket}
        label="Estimated Thrust"
        value={thrust !== undefined && thrust !== null ? thrust.toLocaleString('en-US', { maximumFractionDigits: 0 }) : '—'}
        unit="N"
        sub={thrust ? `${(thrust / 1000).toFixed(2)} kN` : undefined}
        accent
      />
      <MetricCard
        icon={TbDroplet}
        label="TSFC"
        value={tsfc !== undefined && tsfc !== null ? tsfc.toFixed(4) : '—'}
        unit="g/N·s"
        sub="Thrust-Specific Fuel Consumption"
        accent
      />
    </div>
  );
}
