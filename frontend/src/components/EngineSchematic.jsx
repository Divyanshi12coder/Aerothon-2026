// EngineSchematic.jsx – SVG animated four-stage turbojet diagram
import React, { useEffect, useRef } from 'react';

function getHealthColor(val) {
  if (val === null || val === undefined) return '#9CA3AF';
  if (val >= 0.90) return '#1A7A4A';
  if (val >= 0.80) return '#B45309';
  return '#B91C1C';
}

function getHealthBg(val) {
  if (val === null || val === undefined) return '#F3F4F6';
  if (val >= 0.90) return '#E8F5EE';
  if (val >= 0.80) return '#FEF3C7';
  return '#FEE2E2';
}

function getHealthLabel(val) {
  if (val === null || val === undefined) return 'NO DATA';
  if (val >= 0.90) return 'HEALTHY';
  if (val >= 0.80) return 'WARNING';
  return 'CRITICAL';
}

// Animated airflow dot
function AirflowDot({ cx, delay, y, color }) {
  return (
    <circle r="3" fill={color} opacity="0.7">
      <animateMotion
        dur="2.2s"
        begin={`${delay}s`}
        repeatCount="indefinite"
        path={`M ${cx - 260} ${y} L ${cx + 260} ${y}`}
      />
      <animate
        attributeName="opacity"
        values="0;0.7;0.7;0"
        keyTimes="0;0.1;0.85;1"
        dur="2.2s"
        begin={`${delay}s`}
        repeatCount="indefinite"
      />
    </circle>
  );
}

export default function EngineSchematic({ predictions }) {
  const compH  = predictions?.CompressorHealth ?? null;
  const combH  = predictions?.CombustorHealth  ?? null;
  const turbH  = predictions?.TurbineHealth    ?? null;

  const compColor = getHealthColor(compH);
  const combColor = getHealthColor(combH);
  const turbColor = getHealthColor(turbH);

  const compBg = getHealthBg(compH);
  const combBg = getHealthBg(combH);
  const turbBg = getHealthBg(turbH);

  // SVG viewport: 700 x 200
  const W = 700, H = 200;
  const midY = 100;

  // Stage x positions (center of each block)
  const stages = [
    { id: 'intake',     label: 'INTAKE',     x: 40,  w: 60,  color: '#2E6DA4', bg: '#EAF2FB', health: null,  healthStr: '' },
    { id: 'compressor', label: 'COMPRESSOR', x: 170, w: 100, color: compColor, bg: compBg,   health: compH, healthStr: getHealthLabel(compH) },
    { id: 'combustor',  label: 'COMBUSTOR',  x: 340, w: 100, color: combColor, bg: combBg,   health: combH, healthStr: getHealthLabel(combH) },
    { id: 'turbine',    label: 'TURBINE',    x: 510, w: 100, color: turbColor, bg: turbBg,   health: turbH, healthStr: getHealthLabel(turbH) },
    { id: 'exhaust',    label: 'EXHAUST',    x: 660, w: 60,  color: '#2E6DA4', bg: '#EAF2FB', health: null,  healthStr: '' },
  ];

  // Heights for each stage (engine shape – tapers at intake/exhaust, tallest at combustor)
  const heights = { intake: 60, compressor: 80, combustor: 90, turbine: 80, exhaust: 60 };

  return (
    <div className="panel" style={{ overflow: 'hidden' }}>
      {/* Header */}
      <div className="panel-header">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--steel)" strokeWidth="2">
          <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
        </svg>
        <span className="panel-title">Engine Schematic — Four-Stage Turbojet</span>
        {predictions && (
          <span style={{ marginLeft: 'auto', fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            LIVE DATA
          </span>
        )}
      </div>

      {/* SVG Engine Diagram */}
      <div style={{ padding: '16px 12px 8px', background: '#FAFBFC' }}>
        <svg
          viewBox={`0 0 ${W} ${H + 70}`}
          width="100%"
          style={{ display: 'block' }}
        >
          {/* Grid lines - subtle */}
          {[0, 50, 100, 150, 200].map(y => (
            <line key={y} x1="0" y1={y + 10} x2={W} y2={y + 10}
              stroke="rgba(46,109,164,0.06)" strokeWidth="1" />
          ))}
          {[0, 100, 200, 300, 400, 500, 600, 700].map(x => (
            <line key={x} x1={x} y1="10" x2={x} y2={H + 10}
              stroke="rgba(46,109,164,0.06)" strokeWidth="1" />
          ))}

          {/* Flow arrows connecting stages */}
          {[
            [100, 140],  // intake → compressor
            [270, 290],  // compressor → combustor
            [440, 460],  // combustor → turbine
            [610, 630],  // turbine → exhaust
          ].map(([x1, x2], i) => (
            <g key={i}>
              <line x1={x1} y1={midY + 10} x2={x2} y2={midY + 10}
                stroke="#2E6DA4" strokeWidth="2" strokeDasharray="4 3" opacity="0.4" />
              <polygon
                points={`${x2},${midY + 7} ${x2 + 8},${midY + 10} ${x2},${midY + 13}`}
                fill="#2E6DA4" opacity="0.5"
              />
            </g>
          ))}

          {/* Stage blocks */}
          {stages.map((s) => {
            const h = heights[s.id] || 70;
            const x = s.x - s.w / 2;
            const y = midY - h / 2 + 10;

            return (
              <g key={s.id}>
                {/* Shadow */}
                <rect x={x + 2} y={y + 2} width={s.w} height={h}
                  rx="6" fill="rgba(0,0,0,0.06)" />
                {/* Main block */}
                <rect x={x} y={y} width={s.w} height={h}
                  rx="6"
                  fill={s.bg}
                  stroke={s.color}
                  strokeWidth="1.5"
                />
                {/* Top color bar */}
                <rect x={x} y={y} width={s.w} height="4"
                  rx="4" fill={s.color} />
                {/* Label */}
                <text
                  x={s.x} y={midY + 10}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={s.color}
                  fontSize="9"
                  fontFamily="'JetBrains Mono', monospace"
                  fontWeight="700"
                  letterSpacing="0.08em"
                >
                  {s.label}
                </text>

                {/* Health % below label (for active stages) */}
                {s.health !== null && (
                  <>
                    <text
                      x={s.x} y={midY + 24}
                      textAnchor="middle"
                      fill={s.color}
                      fontSize="11"
                      fontFamily="'JetBrains Mono', monospace"
                      fontWeight="600"
                    >
                      {(s.health * 100).toFixed(1)}%
                    </text>
                    <text
                      x={s.x} y={midY - 22}
                      textAnchor="middle"
                      fill={s.color}
                      fontSize="7.5"
                      fontFamily="'JetBrains Mono', monospace"
                      fontWeight="700"
                      letterSpacing="0.06em"
                    >
                      {s.healthStr}
                    </text>
                  </>
                )}
              </g>
            );
          })}

          {/* Airflow animation dots */}
          {predictions && [0, 0.4, 0.8, 1.2, 1.6, 2.0].map((delay, i) => (
            <AirflowDot key={i} cx={W / 2} delay={delay} y={midY + 10} color="#2E6DA4" />
          ))}

          {/* Stage labels below */}
          {stages.map((s) => (
            <text
              key={s.id + '-sub'}
              x={s.x}
              y={H + 8}
              textAnchor="middle"
              fill="#8A9AB0"
              fontSize="8"
              fontFamily="'JetBrains Mono', monospace"
              letterSpacing="0.04em"
            >
              Stage {['I', 'II', 'III', 'IV', 'V'][stages.indexOf(s)]}
            </text>
          ))}

          {/* Centerline */}
          <line x1="20" y1={midY + 10} x2={W - 20} y2={midY + 10}
            stroke="rgba(46,109,164,0.15)" strokeWidth="1" strokeDasharray="2 4" />
        </svg>
      </div>

      {/* No-data overlay text */}
      {!predictions && (
        <div style={{ padding: '0 16px 16px', textAlign: 'center' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Run a prediction to see live engine health coloring
          </span>
        </div>
      )}
    </div>
  );
}
