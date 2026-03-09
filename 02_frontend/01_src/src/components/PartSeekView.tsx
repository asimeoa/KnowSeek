import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload } from 'lucide-react';

interface PartResult {
  id: number;
  name: string;
  partNumber: string;
  revision: string;
  material: string;
  surface: string;
  strengthClass: string;
  faMax: string;
  frMax: string;
  oems: string[];
  dimensions: { label: string; value: string }[];
  drawingLink: string;
}

const mockParts: PartResult[] = [
  {
    id: 1,
    name: "Hex Head Bolt M16x60",
    partNumber: "STD-F-001247",
    revision: "Rev. C",
    material: "X5CrNi18-10 (1.4301)",
    surface: "Zinc flake coating per VDA 233-102",
    strengthClass: "A4-80",
    faMax: "78.2 kN",
    frMax: "45.1 kN",
    oems: ["VW", "Volvo", "Stellantis"],
    dimensions: [
      { label: "A (Thread)", value: "M16" },
      { label: "B (Length)", value: "60 mm" },
      { label: "C (Head Ø)", value: "24 mm" },
      { label: "D (Head H)", value: "10 mm" },
    ],
    drawingLink: "DWG-STD-F-001247-C.pdf",
  },
  {
    id: 2,
    name: "Hex Head Bolt M16x80",
    partNumber: "STD-F-001253",
    revision: "Rev. B",
    material: "42CrMo4 (1.7225)",
    surface: "Hot-dip galvanized per ISO 10684",
    strengthClass: "10.9",
    faMax: "112.5 kN",
    frMax: "63.8 kN",
    oems: ["VW", "GM"],
    dimensions: [
      { label: "A (Thread)", value: "M16" },
      { label: "B (Length)", value: "80 mm" },
      { label: "C (Head Ø)", value: "24 mm" },
      { label: "D (Head H)", value: "10 mm" },
    ],
    drawingLink: "DWG-STD-F-001253-B.pdf",
  },
];

interface PartSeekViewProps {
  query: string;
}

const PartSeekView: React.FC<PartSeekViewProps> = ({ query }) => {
  const [dragOver, setDragOver] = useState(false);
  const hasQuery = query.length > 0;

  return (
    <div className="w-full max-w-2xl mx-auto mt-4">
      {/* Image Upload Zone */}
      <div
        className={`mb-5 rounded-xl border-2 border-dashed p-6 text-center transition-all duration-300 ${dragOver ? 'scale-[1.01]' : ''}`}
        style={{
          borderColor: dragOver ? '#0EA5E9' : '#0EA5E966',
          background: dragOver ? '#0EA5E90F' : 'transparent',
        }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); }}
      >
        <Upload size={20} className="mx-auto mb-2" style={{ color: '#0EA5E9' }} />
        <p className="text-xs" style={{ color: '#0EA5E9' }}>Or upload a photo of the part</p>
        <p className="text-[10px] text-muted-foreground mt-1">Drag and drop or click to browse</p>
      </div>

      {/* Team Alert */}
      {hasQuery && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 rounded-xl"
          style={{ background: '#0EA5E926', border: '1px solid #0EA5E9' }}
        >
          <p className="text-xs" style={{ color: '#0EA5E9' }}>
            💡 Thomas Bauer searched for M16x21 recently. Consider aligning on a shared part.
          </p>
        </motion.div>
      )}

      {/* Results */}
      {hasQuery && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              {mockParts.length} matching parts
            </p>

            <div className="space-y-4">
              {mockParts.map((part, i) => (
                <motion.div
                  key={part.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, type: "spring", stiffness: 300, damping: 30 }}
                  className="glass-card p-0 overflow-hidden hover-lift"
                  style={{ borderColor: '#0EA5E933' }}
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Left: Drawing placeholder + dimensions */}
                    <div className="sm:w-2/5 p-4 flex flex-col items-center justify-center" style={{ borderRight: '1px solid #0EA5E91A' }}>
                      <div
                        className="w-full aspect-square max-w-[160px] rounded-lg flex items-center justify-center mb-3"
                        style={{ background: '#0EA5E90A', border: '1px dashed #0EA5E944' }}
                      >
                        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                          <rect x="10" y="20" width="40" height="12" rx="2" stroke="#0EA5E9" strokeWidth="1" fill="none" />
                          <line x1="10" y1="26" x2="5" y2="26" stroke="#0EA5E966" strokeWidth="0.5" />
                          <line x1="50" y1="26" x2="55" y2="26" stroke="#0EA5E966" strokeWidth="0.5" />
                          <rect x="15" y="14" width="6" height="24" rx="1" stroke="#0EA5E980" strokeWidth="0.8" strokeDasharray="2 1" fill="none" />
                        </svg>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] w-full">
                        {part.dimensions.map((d) => (
                          <div key={d.label} className="flex justify-between">
                            <span style={{ color: '#0EA5E9' }}>{d.label}</span>
                            <span className="text-foreground font-medium">{d.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right: Details */}
                    <div className="sm:w-3/5 p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-sm font-bold text-foreground">{part.name}</h3>
                          <p className="text-xs text-muted-foreground">{part.partNumber} · {part.revision}</p>
                        </div>
                        <a href="#" className="text-[10px] font-medium hover-lift" style={{ color: '#0EA5E9' }}>
                          {part.drawingLink}
                        </a>
                      </div>

                      <div className="space-y-1.5 text-[11px] mb-3">
                        <div className="flex gap-2"><span className="text-muted-foreground w-20">Material</span><span className="text-foreground">{part.material}</span></div>
                        <div className="flex gap-2"><span className="text-muted-foreground w-20">Surface</span><span className="text-foreground">{part.surface}</span></div>
                        <div className="flex gap-2"><span className="text-muted-foreground w-20">Strength</span><span className="text-foreground">{part.strengthClass}</span></div>
                        <div className="flex gap-2"><span className="text-muted-foreground w-20">Fa max</span><span className="text-foreground font-medium">{part.faMax}</span></div>
                        <div className="flex gap-2"><span className="text-muted-foreground w-20">Fr max</span><span className="text-foreground font-medium">{part.frMax}</span></div>
                      </div>

                      {/* OEM badges */}
                      <div className="flex gap-1.5 mb-3">
                        {part.oems.map(oem => (
                          <span
                            key={oem}
                            className="px-2 py-0.5 rounded-md text-[9px] font-bold"
                            style={{ background: '#0EA5E91A', color: '#0EA5E9', border: '1px solid #0EA5E933' }}
                          >
                            {oem}
                          </span>
                        ))}
                      </div>

                      {/* Phase 2 placeholders */}
                      <div className="flex gap-3 opacity-40">
                        <span className="text-[10px] text-muted-foreground cursor-not-allowed" title="Coming in Phase 2">
                          📁 Used in projects
                        </span>
                        <span className="text-[10px] text-muted-foreground cursor-not-allowed" title="Coming in Phase 2">
                          🔧 Recommended torque values
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {!hasQuery && (
        <p className="text-center text-sm text-muted-foreground mt-8">
          Start by uploading a document or asking a question.
        </p>
      )}
    </div>
  );
};

export default PartSeekView;
