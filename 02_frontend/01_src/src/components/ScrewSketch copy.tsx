import React from 'react';

type ScrewDims = {
  D?: string | null;   // Thread / shaft diameter
  Dk?: string | null;  // Head diameter (Ø)
  l?: string | null;   // Length
  k?: string | null;   // Head height
};

interface ScrewSketchProps {
  dims?: ScrewDims;
}

function na(value?: string | null): string {
  if (value === null || value === undefined) return '—';
  const text = String(value).trim();
  return text.length > 0 && text.toUpperCase() !== 'N/A' ? text : '—';
}

const ScrewSketch: React.FC<ScrewSketchProps> = ({ dims }) => {
  const D  = na(dims?.D);
  const Dk = na(dims?.Dk);
  const l  = na(dims?.l);
  const k  = na(dims?.k);

  return (
    <div className="flex flex-col gap-3">

      {/* Sketch area with dashed border */}
      <div
        className="w-full rounded-xl"
        style={{
          border: '1.5px dashed #2D5A8A',
          background: '#0A1628',
          aspectRatio: '4/3',
        }}
      >
        <svg
          viewBox="0 0 300 200"
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full"
          role="img"
          aria-label="Hex bolt engineering sketch"
        >
          <defs>
            <marker id="sk-a" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto">
              <path d="M0,0 L5,2.5 L0,5 z" fill="#4D9FE0" />
            </marker>
            <marker id="sk-b" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto-start-reverse">
              <path d="M0,0 L5,2.5 L0,5 z" fill="#4D9FE0" />
            </marker>
          </defs>

          {/* Bolt head (left block) */}
          <rect x="72" y="68" width="56" height="64" fill="#0E1F38" stroke="#3A8FD4" strokeWidth="2" />

          {/* Shaft */}
          <rect x="128" y="83" width="100" height="34" fill="#0E1F38" stroke="#3A8FD4" strokeWidth="2" rx="3" />

          {/* Shaft centre line */}
          <line x1="128" y1="100" x2="228" y2="100" stroke="#3A8FD4" strokeWidth="0.7" strokeDasharray="4,3" opacity="0.4" />

          {/* === k: head width, horizontal top === */}
          <line x1="72"  y1="57" x2="72"  y2="66" stroke="#4D9FE0" strokeWidth="1" />
          <line x1="128" y1="57" x2="128" y2="66" stroke="#4D9FE0" strokeWidth="1" />
          <line x1="76"  y1="57" x2="124" y2="57" stroke="#4D9FE0" strokeWidth="1.3" markerStart="url(#sk-b)" markerEnd="url(#sk-a)" />
          <text x="100" y="51" textAnchor="middle" fill="#4D9FE0" fontSize="11" fontWeight="700" fontFamily="monospace">k</text>

          {/* === dₖ: head height, vertical left === */}
          <line x1="58" y1="68"  x2="70"  y2="68"  stroke="#4D9FE0" strokeWidth="1" />
          <line x1="58" y1="132" x2="70"  y2="132" stroke="#4D9FE0" strokeWidth="1" />
          <line x1="58" y1="72"  x2="58"  y2="128" stroke="#4D9FE0" strokeWidth="1.3" markerStart="url(#sk-b)" markerEnd="url(#sk-a)" />
          <text x="44" y="97"  textAnchor="middle" fill="#4D9FE0" fontSize="10" fontWeight="700" fontFamily="monospace">d</text>
          <text x="48" y="103" textAnchor="middle" fill="#4D9FE0" fontSize="8"  fontFamily="monospace">k</text>

          {/* === d: shaft diameter, vertical right === */}
          <line x1="232" y1="83"  x2="244" y2="83"  stroke="#4D9FE0" strokeWidth="1" />
          <line x1="232" y1="117" x2="244" y2="117" stroke="#4D9FE0" strokeWidth="1" />
          <line x1="240" y1="87"  x2="240" y2="113" stroke="#4D9FE0" strokeWidth="1.3" markerStart="url(#sk-b)" markerEnd="url(#sk-a)" />
          <text x="252" y="103" textAnchor="middle" fill="#4D9FE0" fontSize="11" fontWeight="700" fontFamily="monospace">d</text>

          {/* === l: shaft length, horizontal bottom === */}
          <line x1="128" y1="119" x2="128" y2="148" stroke="#4D9FE0" strokeWidth="1" />
          <line x1="228" y1="119" x2="228" y2="148" stroke="#4D9FE0" strokeWidth="1" />
          <line x1="132" y1="148" x2="224" y2="148" stroke="#4D9FE0" strokeWidth="1.3" markerStart="url(#sk-b)" markerEnd="url(#sk-a)" />
          <text x="178" y="162" textAnchor="middle" fill="#4D9FE0" fontSize="11" fontWeight="700" fontFamily="monospace">l</text>
        </svg>
      </div>

      {/* Engineering Symbol Legend — 2 columns × 2 rows */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 w-full px-1 border-t border-[#1A314F] pt-3">

        {/* d = Thread */}
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-1.5">
            <span className="font-serif italic font-bold text-[#0EA5E9] text-sm">d</span>
            <span className="text-slate-500 text-[10px]">(Thread)</span>
          </div>
          <span className="font-mono text-white text-[11px] font-semibold">{D === '—' ? <span className="text-slate-600">n/a</span> : D}</span>
        </div>

        {/* l = Length */}
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-1.5">
            <span className="font-serif italic font-bold text-[#0EA5E9] text-sm">l</span>
            <span className="text-slate-500 text-[10px]">(Length)</span>
          </div>
          <span className="font-mono text-white text-[11px] font-semibold">{l === '—' ? <span className="text-slate-600">n/a</span> : l}</span>
        </div>

        {/* dk = Head Diameter */}
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-1.5">
            <span className="font-serif italic font-bold text-[#0EA5E9] text-sm">
              d<sub className="text-[9px]">k</sub>
            </span>
            <span className="text-slate-500 text-[10px]">(Head Ø)</span>
          </div>
          <span className="font-mono text-white text-[11px] font-semibold">{Dk === '—' ? <span className="text-slate-600">n/a</span> : Dk}</span>
        </div>

        {/* k = Head Height */}
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-1.5">
            <span className="font-serif italic font-bold text-[#0EA5E9] text-sm">k</span>
            <span className="text-slate-500 text-[10px]">(Head h)</span>
          </div>
          <span className="font-mono text-white text-[11px] font-semibold">{k === '—' ? <span className="text-slate-600">n/a</span> : k}</span>
        </div>

      </div>

    </div>
  );
};

export default ScrewSketch;
