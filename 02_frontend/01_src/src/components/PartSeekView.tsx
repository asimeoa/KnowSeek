/**
 * PartSeekView.tsx - Part Search View Component
 *
 * Shows search results with confidence scores
 * Connected to real backend API
 *
 * Version: rev06_002
 * Branch:  main_sia07
 * Date:    26.03.2026 09:00
 * Status:  Connected to real API - NO MOCK DATA
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Loader2 } from 'lucide-react';

interface PartResult {
  rank: number;
  score: number;
  signal: string;
  text: string;
  oem_code: string;
  oem_real: string | null;
  category: string;
  page: number;
  norm: string | null;
  thread_size: string | null;
  strength_class: string | null;
  drive_type: string | null;
  coating: string | null;
  self_locking: boolean;
}

interface ApiResponse {
  query: string;
  found: boolean;
  confidence: number;
  signal: string;
  signal_icon: string;
  results: PartResult[];
  time_ms: number;
  collision: {
    collision: boolean;
    message: string;
    score?: number;
    oem_code?: string;
  };
}

interface PartSeekViewProps {
  query: string;
}

const API_URL = 'http://localhost:8001';

const signalColor = {
  GREEN:  '#10B981',
  YELLOW: '#F59E0B',
  RED:    '#EF4444',
};

const PartSeekView: React.FC<PartSeekViewProps> = ({ query }) => {
  const [dragOver, setDragOver]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [apiData, setApiData]     = useState<ApiResponse | null>(null);
  const [lastQuery, setLastQuery] = useState('');
  const hasQuery = query.length > 0;

  // Fetch from API when query changes
  React.useEffect(() => {
    if (!hasQuery || query === lastQuery) return;
    setLastQuery(query);
    setLoading(true);
    setApiData(null);

    fetch(`${API_URL}/api/partseek/query`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ question: query }),
    })
      .then(r => r.json())
      .then(data => { setApiData(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [query]);

  const results = apiData?.results ?? [];

  return (
    <div className="w-full max-w-2xl mx-auto mt-4">

      {/* Image Upload Zone */}
      <div
        className={`mb-5 rounded-xl border-2 border-dashed p-6 text-center transition-all duration-300 ${dragOver ? 'scale-[1.01]' : ''}`}
        style={{
          borderColor: dragOver ? '#0EA5E9' : '#0EA5E966',
          background:  dragOver ? '#0EA5E90F' : 'transparent',
        }}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); }}
      >
        <Upload size={20} className="mx-auto mb-2" style={{ color: '#0EA5E9' }} />
        <p className="text-xs" style={{ color: '#0EA5E9' }}>Or upload a photo of the part</p>
        <p className="text-[10px] text-muted-foreground mt-1">Drag and drop or click to browse</p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center gap-2 py-8">
          <Loader2 size={18} className="animate-spin" style={{ color: '#0EA5E9' }} />
          <span className="text-xs" style={{ color: '#0EA5E9' }}>Searching parts...</span>
        </div>
      )}

      {/* Collision Warning */}
      {!loading && apiData?.collision?.collision && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 rounded-xl"
          style={{ background: '#0EA5E926', border: '1px solid #0EA5E9' }}
        >
          <p className="text-xs" style={{ color: '#0EA5E9' }}>
            💡 {apiData.collision.message} — Consider aligning on a shared part.
          </p>
        </motion.div>
      )}

      {/* Results */}
      {!loading && hasQuery && results.length > 0 && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {results.length} matching parts
              </p>
              <span className="text-[10px] text-muted-foreground">
                {apiData?.signal_icon} {Math.round((apiData?.confidence ?? 0) * 100)}% confidence · {apiData?.time_ms}ms
              </span>
            </div>

            <div className="space-y-4">
              {results.map((part, i) => {
                const color  = '#0EA5E9';
                const icon   = part.signal === 'GREEN' ? '🟢' : part.signal === 'YELLOW' ? '🟡' : '🔴';

                return (
                  <motion.div
                    key={part.rank}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, type: 'spring', stiffness: 300, damping: 30 }}
                    className="glass-card p-0 overflow-hidden hover-lift"
                    style={{ borderColor: `${color}33` }}
                  >
                    <div className="flex flex-col sm:flex-row">

                      {/* Left — Drawing + Dimensions */}
                      <div
                        className="sm:w-2/5 p-4 flex flex-col items-center justify-center"
                        style={{ borderRight: `1px solid ${color}1A` }}
                      >
                        {/* Drawing placeholder */}
                        <div
                          className="w-full aspect-square max-w-[140px] rounded-lg flex items-center justify-center mb-3"
                          style={{ background: `${color}0A`, border: `1px dashed ${color}44` }}
                        >
                          <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                            <rect x="10" y="20" width="40" height="12" rx="2" stroke={color} strokeWidth="1" fill="none" />
                            <line x1="10" y1="26" x2="5" y2="26" stroke={`${color}66`} strokeWidth="0.5" />
                            <line x1="50" y1="26" x2="55" y2="26" stroke={`${color}66`} strokeWidth="0.5" />
                            <rect x="15" y="14" width="6" height="24" rx="1" stroke={`${color}80`} strokeWidth="0.8" strokeDasharray="2 1" fill="none" />
                          </svg>
                        </div>

                        {/* Dimensions from API data */}
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] w-full">
                          {part.thread_size && (
                            <div className="flex justify-between col-span-2">
                              <span style={{ color }}>Thread</span>
                              <span className="text-foreground font-medium">{part.thread_size}</span>
                            </div>
                          )}
                          {part.strength_class && (
                            <div className="flex justify-between col-span-2">
                              <span style={{ color }}>Class</span>
                              <span className="text-foreground font-medium">{part.strength_class}</span>
                            </div>
                          )}
                          {part.drive_type && (
                            <div className="flex justify-between col-span-2">
                              <span style={{ color }}>Drive</span>
                              <span className="text-foreground font-medium">{part.drive_type}</span>
                            </div>
                          )}
                          {part.coating && (
                            <div className="flex justify-between col-span-2">
                              <span style={{ color }}>Coating</span>
                              <span className="text-foreground font-medium">{part.coating}</span>
                            </div>
                          )}
                          {!part.thread_size && !part.strength_class && !part.drive_type && (
                            <div className="col-span-2 text-center text-muted-foreground text-[9px]">
                              See document for specs
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right — Details */}
                      <div className="sm:w-3/5 p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-sm font-bold text-foreground">
                              {part.category} — {part.thread_size ?? 'Part'}
                              {part.strength_class ? ` ${part.strength_class}` : ''}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              p.{part.page} · {part.norm ? part.norm.slice(0, 20) : part.category}
                            </p>
                          </div>
                          <span className="text-[11px]">{icon}</span>
                        </div>

                        {/* Details */}
                        <div className="space-y-1.5 text-[11px] mb-3">
                          {part.strength_class && (
                            <div className="flex gap-2">
                              <span className="text-muted-foreground w-20">Strength</span>
                              <span className="text-foreground">{part.strength_class}</span>
                            </div>
                          )}
                          {part.drive_type && (
                            <div className="flex gap-2">
                              <span className="text-muted-foreground w-20">Drive</span>
                              <span className="text-foreground">{part.drive_type}</span>
                            </div>
                          )}
                          {part.coating && (
                            <div className="flex gap-2">
                              <span className="text-muted-foreground w-20">Coating</span>
                              <span className="text-foreground">{part.coating}</span>
                            </div>
                          )}
                          {part.self_locking && (
                            <div className="flex gap-2">
                              <span className="text-muted-foreground w-20">Self-lock</span>
                              <span className="text-foreground">✅ Yes</span>
                            </div>
                          )}
                          <div className="flex gap-2">
                            <span className="text-muted-foreground w-20">Score</span>
                            <span className="text-foreground font-medium">
                              {Math.round(part.score * 100)}%
                            </span>
                          </div>
                        </div>

                        {/* OEM Badge */}
                        <div className="flex gap-1.5 mb-3 flex-wrap">
                          {part.oem_code && part.oem_code !== 'OEM-UNKNOWN' && (
                            <span
                              className="px-2 py-0.5 rounded-md text-[9px] font-bold"
                              style={{ background: `${color}1A`, color, border: `1px solid ${color}33` }}
                            >
                              {part.oem_code}
                            </span>
                          )}
                          {part.oem_real && (
                            <span
                              className="px-2 py-0.5 rounded-md text-[9px] font-bold"
                              style={{ background: '#ffffff0A', color: '#9CA3AF', border: '1px solid #374151' }}
                            >
                              {part.oem_real}
                            </span>
                          )}
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
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Not found */}
      {!loading && hasQuery && apiData && !apiData.found && (
        <p className="text-center text-sm text-muted-foreground mt-8">
          🔴 No parts found for "{query}" — try different search terms.
        </p>
      )}

      {/* Empty state */}
      {!hasQuery && (
        <p className="text-center text-sm text-muted-foreground mt-8">
          Start by uploading a document or asking a question.
        </p>
      )}
    </div>
  );
};

export default PartSeekView;
