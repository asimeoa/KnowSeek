import React from 'react';

type ScrewDims = {
  D?: string | null;   // d  — Thread / shaft diameter
  Dk?: string | null;  // dk — Head diameter (Ø)
  l?: string | null;   // l  — Shaft length
  k?: string | null;   // k  — Head width
};

interface ScrewSketchProps {
  dims?: ScrewDims;
}

function na(value?: string | null): string {
  if (value === null || value === undefined) return '—';
  const text = String(value).trim();
  return text.length > 0 && text.toUpperCase() !== 'N/A' ? text : '—';
}

// Colors matching the reference image
const C_PART = '#3A7FBF';   // bolt geometry stroke
const C_DIM  = '#2E6090';   // dimension lines
const C_LBL  = '#5BA3D9';   // letter labels

const ScrewSketch: React.FC<ScrewSketchProps> = ({ dims }) => {
  const D  = na(dims?.D);
  const Dk = na(dims?.Dk);
  const l  = na(dims?.l);
  const k  = na(dims?.k);

  // Bolt geometry coordinates (viewBox 320 220)
  // Head: x=80, y=50, w=55, h=100  → center y=100
  // Shaft: x=135, y=72, w=125, h=56 → center y=100, rx=10
  const hx = 80,  hy = 50,  hw = 55, hh = 100;  // head
  const sx = 135, sy = 72,  sw = 125, sh = 56;   // shaft
  const cx = sx + sw;                             // shaft right edge = 260

  return (
    <div className="flex flex-col gap-3">

      {/* ── Sketch area ── */}
      <div
        className="w-full rounded-xl"
        style={{ background: '#0A1628', aspectRatio: '3/2' }}
      >
        <svg
          viewBox="0 0 320 220"
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full"
          aria-label="Bolt engineering sketch"
        >
          <defs>
            {/* Arrow tip — pointing right / down */}
            <marker id="ae" markerWidth="5" markerHeight="5" refX="4.5" refY="2.5" orient="auto">
              <path d="M0,0 L5,2.5 L0,5 z" fill={C_DIM} />
            </marker>
            {/* Arrow tip — pointing left / up */}
            <marker id="as" markerWidth="5" markerHeight="5" refX="0.5" refY="2.5" orient="auto-start-reverse">
              <path d="M0,0 L5,2.5 L0,5 z" fill={C_DIM} />
            </marker>
          </defs>

          {/* ── Bolt geometry ── */}
          {/* Head (tall rectangle, left) */}
          <rect
            x={hx} y={hy} width={hw} height={hh}
            fill="#0D1A2E" stroke={C_PART} strokeWidth="2"
          />
          {/* Shaft (wide rounded rectangle, right) */}
          <rect
            x={sx} y={sy} width={sw} height={sh}
            fill="#0D1A2E" stroke={C_PART} strokeWidth="2" rx="10"
          />
          {/* Centre line */}
          <line
            x1={hx - 10} y1="100" x2={cx + 15} y2="100"
            stroke={C_PART} strokeWidth="0.6" strokeDasharray="8,3,2,3" opacity="0.45"
          />

          {/* ── k : head width, horizontal top ── */}
          {/* Witness lines (tick marks from head corners upward) */}
          <line x1={hx}      y1={hy - 2}  x2={hx}      y2={hy - 14} stroke={C_DIM} strokeWidth="1" />
          <line x1={hx + hw} y1={hy - 2}  x2={hx + hw} y2={hy - 14} stroke={C_DIM} strokeWidth="1" />
          {/* Dimension arrow */}
          <line
            x1={hx + 3}      y1={hy - 10}
            x2={hx + hw - 3} y2={hy - 10}
            stroke={C_DIM} strokeWidth="1.2" markerStart="url(#as)" markerEnd="url(#ae)"
          />
          {/* Label */}
          <text
            x={hx + hw / 2} y={hy - 16}
            textAnchor="middle" fill={C_LBL}
            fontSize="13" fontWeight="700" fontStyle="italic" fontFamily="serif"
          >k</text>

          {/* ── dk : head height, vertical left ── */}
          {/* Witness lines (extend left from head corners) */}
          <line x1={hx - 2}  y1={hy}      x2={hx - 20} y2={hy}      stroke={C_DIM} strokeWidth="1" />
          <line x1={hx - 2}  y1={hy + hh} x2={hx - 20} y2={hy + hh} stroke={C_DIM} strokeWidth="1" />
          {/* Dimension arrow */}
          <line
            x1={hx - 16} y1={hy + 3}
            x2={hx - 16} y2={hy + hh - 3}
            stroke={C_DIM} strokeWidth="1.2" markerStart="url(#as)" markerEnd="url(#ae)"
          />
          {/* Label */}
          <text
            x={hx - 32} y={97}
            textAnchor="middle" fill={C_LBL}
            fontSize="13" fontWeight="700" fontStyle="italic" fontFamily="serif"
          >d</text>
          <tspan></tspan>
          <text
            x={hx - 26} y={104}
            textAnchor="middle" fill={C_LBL}
            fontSize="9" fontFamily="serif"
          >k</text>

          {/* ── d : shaft diameter, vertical right ── */}
          {/* Witness lines */}
          <line x1={cx + 2}  y1={sy}      x2={cx + 18} y2={sy}      stroke={C_DIM} strokeWidth="1" />
          <line x1={cx + 2}  y1={sy + sh} x2={cx + 18} y2={sy + sh} stroke={C_DIM} strokeWidth="1" />
          {/* Dimension arrow */}
          <line
            x1={cx + 14} y1={sy + 3}
            x2={cx + 14} y2={sy + sh - 3}
            stroke={C_DIM} strokeWidth="1.2" markerStart="url(#as)" markerEnd="url(#ae)"
          />
          {/* Label */}
          <text
            x={cx + 28} y={101}
            textAnchor="middle" fill={C_LBL}
            fontSize="13" fontWeight="700" fontStyle="italic" fontFamily="serif"
          >d</text>

          {/* ── l : shaft length, horizontal bottom ── */}
          {/* Witness lines */}
          <line x1={sx}      y1={sy + sh + 2}  x2={sx}      y2={sy + sh + 20} stroke={C_DIM} strokeWidth="1" />
          <line x1={cx}      y1={sy + sh + 2}  x2={cx}      y2={sy + sh + 20} stroke={C_DIM} strokeWidth="1" />
          {/* Dimension arrow */}
          <line
            x1={sx + 3}  y1={sy + sh + 16}
            x2={cx - 3}  y2={sy + sh + 16}
            stroke={C_DIM} strokeWidth="1.2" markerStart="url(#as)" markerEnd="url(#ae)"
          />
          {/* Label */}
          <text
            x={(sx + cx) / 2} y={sy + sh + 32}
            textAnchor="middle" fill={C_LBL}
            fontSize="13" fontWeight="700" fontStyle="italic" fontFamily="serif"
          >l</text>
        </svg>
      </div>

      {/* ── Legend (2 × 2 grid) ── */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 px-1 border-t border-[#1A314F] pt-3">

        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-1.5">
            <span className="font-serif italic text-[#5BA3D9] text-sm">d</span>
            <span className="text-slate-500 text-[10px]">(Thread)</span>
          </div>
          <span className="font-mono text-[11px]">
            {D === '—' ? <span className="text-slate-600">n/a</span> : <span className="text-white font-semibold">{D}</span>}
          </span>
        </div>

        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-1.5">
            <span className="font-serif italic text-[#5BA3D9] text-sm">l</span>
            <span className="text-slate-500 text-[10px]">(Length)</span>
          </div>
          <span className="font-mono text-[11px]">
            {l === '—' ? <span className="text-slate-600">n/a</span> : <span className="text-white font-semibold">{l}</span>}
          </span>
        </div>

        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-1.5">
            <span className="font-serif italic text-[#5BA3D9] text-sm">
              d<sub className="text-[9px]">k</sub>
            </span>
            <span className="text-slate-500 text-[10px]">(Head Ø)</span>
          </div>
          <span className="font-mono text-[11px]">
            {Dk === '—' ? <span className="text-slate-600">n/a</span> : <span className="text-white font-semibold">{Dk}</span>}
          </span>
        </div>

        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-1.5">
            <span className="font-serif italic text-[#5BA3D9] text-sm">k</span>
            <span className="text-slate-500 text-[10px]">(Head h)</span>
          </div>
          <span className="font-mono text-[11px]">
            {k === '—' ? <span className="text-slate-600">n/a</span> : <span className="text-white font-semibold">{k}</span>}
          </span>
        </div>

      </div>
    </div>
  );
};

export default ScrewSketch;
