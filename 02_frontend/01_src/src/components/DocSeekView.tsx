import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DocResult {
  id: number;
  answer: string;
  confidence: number;
  source: string;
  page: number;
  date: string;
  excerpt: string;
}

const mockResults: DocResult[] = [
  {
    id: 1,
    answer: "The salt spray test requirement for Volvo is minimum 720 hours according to VCS 1027,149. The test must be conducted per ISO 9227 with a 5% NaCl solution at 35°C ± 2°C.",
    confidence: 94,
    source: "VCS_1027_149_Corrosion_Protection.pdf",
    page: 14,
    date: "2024-03-15",
    excerpt: "Section 4.2.1: All exterior fasteners shall withstand a minimum of 720 hours neutral salt spray testing per ISO 9227. Acceptance criteria: No red rust on functional surfaces...",
  },
  {
    id: 2,
    answer: "VW requires 480 hours for salt spray testing on underbody fasteners per TL 217 standard, which is lower than the Volvo requirement.",
    confidence: 89,
    source: "TL_217_VW_Corrosion_Standard.pdf",
    page: 8,
    date: "2023-11-20",
    excerpt: "Section 3.1: Underbody fastener components — minimum 480h NSS per DIN EN ISO 9227. Class C2 corrosion protection required for all M8 and above...",
  },
  {
    id: 3,
    answer: "GM's GMW14872 specifies cyclic corrosion testing instead of salt spray, requiring 80 cycles equivalent to approximately 960 hours.",
    confidence: 82,
    source: "GMW14872_Cyclic_Corrosion.pdf",
    page: 22,
    date: "2024-01-10",
    excerpt: "Procedure B: 80 complete cycles. Each cycle = 8h salt spray + 8h dry + 8h humidity. Total exposure: approx. 960 equivalent hours...",
  },
];

const comparisonData = [
  { requirement: "Salt spray duration", doc: "Volvo VCS 1027", value: "720h", status: "different" as const },
  { requirement: "Salt spray duration", doc: "VW TL 217", value: "480h", status: "different" as const },
  { requirement: "Test method", doc: "Volvo VCS 1027", value: "ISO 9227", status: "same" as const },
  { requirement: "Test method", doc: "VW TL 217", value: "ISO 9227", status: "same" as const },
  { requirement: "Test method", doc: "GM GMW14872", value: "Cyclic (proprietary)", status: "conflict" as const },
  { requirement: "Temperature", doc: "All OEMs", value: "35°C ± 2°C", status: "same" as const },
];

interface DocSeekViewProps {
  onSearch: (query: string) => void;
  query: string;
}

const DocSeekView: React.FC<DocSeekViewProps> = ({ query }) => {
  const [selectedResult, setSelectedResult] = useState<DocResult | null>(null);
  const [recentSearches] = useState([
    "Salt spray test requirements Volvo",
    "VDA 233-102 differences",
    "Zinc flake coating minimum thickness",
    "DIN EN ISO 4042 requirements",
  ]);

  const hasQuery = query.length > 0;
  const statusColors = {
    same: { bg: '#10B98126', border: '#10B981', text: '#10B981', label: 'Same' },
    different: { bg: '#EF444426', border: '#EF4444', text: '#EF4444', label: 'Different' },
    conflict: { bg: '#F59E0B26', border: '#F59E0B', text: '#F59E0B', label: 'Conflict' },
  };

  const sorted = [...comparisonData].sort((a, b) => {
    const order = { conflict: 0, different: 1, same: 2 };
    return order[a.status] - order[b.status];
  });

  return (
    <div className="w-full max-w-2xl mx-auto mt-4">
      {/* Recent searches */}
      {!hasQuery && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Recent searches</p>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((s, i) => (
              <button
                key={i}
                className="glass-card px-3 py-1.5 text-xs text-muted-foreground hover:text-docseek transition-colors hover-lift"
              >
                {s}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Results */}
      {hasQuery && (
        <AnimatePresence mode="wait">
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              {mockResults.length} results found
            </p>

            <div className="space-y-3 mb-6">
              {mockResults.map((result, i) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, type: "spring", stiffness: 300, damping: 30 }}
                  onClick={() => setSelectedResult(selectedResult?.id === result.id ? null : result)}
                  className="glass-card p-4 cursor-pointer hover-lift"
                  style={{ borderColor: '#10B98133' }}
                >
                  <p className="text-sm text-foreground leading-relaxed">{result.answer}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-md"
                      style={{ background: '#10B98126', color: '#10B981' }}
                    >
                      {result.confidence}% confidence
                    </span>
                    <span className="text-[11px] text-muted-foreground truncate">{result.source}</span>
                    <span className="text-[11px] text-muted-foreground">p.{result.page}</span>
                  </div>

                  {/* Expanded source panel */}
                  <AnimatePresence>
                    {selectedResult?.id === result.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t" style={{ borderColor: '#10B98133' }}>
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="text-xs font-semibold" style={{ color: '#10B981' }}>{result.source}</p>
                              <p className="text-[10px] text-muted-foreground">Page {result.page} · {result.date}</p>
                            </div>
                            <div className="flex gap-2">
                              <button className="glass-card px-3 py-1 text-[10px] font-medium hover-lift" style={{ color: '#10B981' }}>
                                Download
                              </button>
                              <button className="glass-card px-3 py-1 text-[10px] font-medium hover-lift" style={{ color: '#10B981' }}>
                                Summarize
                              </button>
                            </div>
                          </div>
                          <div className="rounded-lg p-3" style={{ background: '#10B9810A', border: '1px solid #10B98126' }}>
                            <p className="text-xs text-muted-foreground leading-relaxed italic">
                              "{result.excerpt}"
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            {/* Risk Comparison Table */}
            <div className="glass-card p-4 mb-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Risk Comparison
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b" style={{ borderColor: '#10B98126' }}>
                      <th className="text-left py-2 text-muted-foreground font-medium">Requirement</th>
                      <th className="text-left py-2 text-muted-foreground font-medium">Document / OEM</th>
                      <th className="text-left py-2 text-muted-foreground font-medium">Value</th>
                      <th className="text-left py-2 text-muted-foreground font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map((row, i) => {
                      const sc = statusColors[row.status];
                      return (
                        <tr key={i} className="border-b border-border/30">
                          <td className="py-2 text-foreground">{row.requirement}</td>
                          <td className="py-2 text-muted-foreground">{row.doc}</td>
                          <td className="py-2 text-foreground font-medium">{row.value}</td>
                          <td className="py-2">
                            <span
                              className="px-2 py-0.5 rounded-md text-[10px] font-bold"
                              style={{ background: sc.bg, color: sc.text, border: `1px solid ${sc.border}40` }}
                            >
                              {sc.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
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

export default DocSeekView;
