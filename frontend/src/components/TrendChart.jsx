// TrendChart.jsx – Health trend over prediction history using Recharts
import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { TbChartLine } from 'react-icons/tb';

const LINES = [
  { key: 'overall',    label: 'Overall Health',    color: '#1C3A5C' },
  { key: 'compressor', label: 'Compressor Health',  color: '#2E6DA4' },
  { key: 'combustor',  label: 'Combustor Health',   color: '#0E7490' },
  { key: 'turbine',    label: 'Turbine Health',     color: '#D97706' },
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: 'white',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        padding: '10px 14px',
        boxShadow: 'var(--shadow-md)',
        fontSize: '11px',
        fontFamily: 'var(--font-mono)',
      }}
    >
      <div style={{ fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
        Prediction #{label}
      </div>
      {payload.map((entry) => (
        <div key={entry.dataKey} style={{ color: entry.color, display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
          <span>{entry.name}</span>
          <span style={{ fontWeight: 700 }}>{(entry.value * 100).toFixed(2)}%</span>
        </div>
      ))}
    </div>
  );
}

export default function TrendChart({ history }) {
  if (!history || history.length === 0) {
    return (
      <div className="panel">
        <div className="panel-header">
          <TbChartLine size={14} style={{ color: 'var(--steel)' }} />
          <span className="panel-title">Health Trend History</span>
        </div>
        <div className="no-data-state" style={{ padding: '30px' }}>
          <TbChartLine size={32} style={{ color: 'var(--border)' }} />
          <p className="no-data-text">Run predictions to populate the trend chart</p>
        </div>
      </div>
    );
  }

  const chartData = history.map((entry, i) => ({
    index: i + 1,
    overall:    entry.predictions.OverallHealth,
    compressor: entry.predictions.CompressorHealth,
    combustor:  entry.predictions.CombustorHealth,
    turbine:    entry.predictions.TurbineHealth,
  }));

  return (
    <div className="panel animate-fadeIn">
      <div className="panel-header">
        <TbChartLine size={14} style={{ color: 'var(--steel)' }} />
        <span className="panel-title">Health Trend History</span>
        <span style={{ marginLeft: 'auto', fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          {history.length} prediction{history.length !== 1 ? 's' : ''}
        </span>
      </div>
      <div style={{ padding: '16px 16px 12px' }}>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 4" stroke="rgba(0,0,0,0.05)" />

            {/* Threshold reference lines */}
            <ReferenceLine y={0.90} stroke="#1A7A4A" strokeDasharray="4 3" strokeWidth={1} opacity={0.5}
              label={{ value: '90% Healthy', fill: '#1A7A4A', fontSize: 9, position: 'insideBottomRight' }} />
            <ReferenceLine y={0.80} stroke="#B45309" strokeDasharray="4 3" strokeWidth={1} opacity={0.5}
              label={{ value: '80% Warning', fill: '#B45309', fontSize: 9, position: 'insideBottomRight' }} />

            <XAxis
              dataKey="index"
              tick={{ fontSize: 10, fontFamily: 'var(--font-mono)', fill: '#8A9AB0' }}
              axisLine={{ stroke: 'var(--border-light)' }}
              tickLine={false}
              label={{ value: 'Prediction #', position: 'insideBottom', offset: -2, fontSize: 10, fill: '#8A9AB0' }}
            />
            <YAxis
              domain={[0.60, 1.0]}
              tickFormatter={v => `${(v * 100).toFixed(0)}%`}
              tick={{ fontSize: 10, fontFamily: 'var(--font-mono)', fill: '#8A9AB0' }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconType="plainline"
              iconSize={16}
              wrapperStyle={{ fontSize: '10px', fontFamily: 'var(--font-mono)', paddingTop: '8px' }}
            />

            {LINES.map(({ key, label, color }) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                name={label}
                stroke={color}
                strokeWidth={2}
                dot={{ r: 3, fill: color, stroke: 'white', strokeWidth: 1.5 }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
