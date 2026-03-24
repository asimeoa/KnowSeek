/**
 * DocSeekView.tsx - Document Search View Component
 * 
 * Shows search results with confidence scores
 * Connected to real backend API
 * 
 * Version: rev05_004
 * Branch:  main_sia06
 * Date:    24.03.2026 08:24
 * Status:  Connected to real API - NO MOCK DATA
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { askDocSeek, type DocSeekResponse } from '@/lib/api';

interface DocSeekViewProps {
  onSearch: (query: string) => void;
  query: string;
}

const DocSeekView: React.FC<DocSeekViewProps> = ({ query }) => {
  // ─────────────────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────────────────
  
  const [selectedSourceIndex, setSelectedSourceIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [realData, setRealData] = useState<DocSeekResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [recentSearches] = useState([
    "Salt spray test requirements",
    "Corrosion protection standards",
    "Coating thickness requirements",
    "DIN EN ISO standards",
  ]);

  
  // ─────────────────────────────────────────────────────
  // API CALL - When query changes
  // ─────────────────────────────────────────────────────
  
  useEffect(() => {
    if (query.length > 0) {
      setLoading(true);
      setError(null);
      
      askDocSeek({ question: query })
        .then((response) => {
          setRealData(response);
          setLoading(false);
        })
        .catch((err) => {
          console.error('API Error:', err);
          setError('Failed to connect to backend. Is it running on port 8001?');
          setLoading(false);
        });
    } else {
      setRealData(null);
    }
  }, [query]);

  
  // ─────────────────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────────────────
  
  const hasQuery = query.length > 0;
  
  const getConfidenceColor = (signal: string) => {
    if (signal === "GREEN") return { bg: '#10B98126', text: '#10B981', border: '#10B981' };
    if (signal === "YELLOW") return { bg: '#F59E0B26', text: '#F59E0B', border: '#F59E0B' };
    return { bg: '#EF444426', text: '#EF4444', border: '#EF4444' };
  };

  
  // ─────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────
  
  return (
    <div className="w-full max-w-2xl mx-auto mt-4">
      
      {/* RECENT SEARCHES - Only show when no query */}
      {!hasQuery && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Recent searches
          </p>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((s, i) => (
              <button
                key={i}
                className="glass-card px-3 py-1.5 text-xs text-muted-foreground hover:text-docseek transition-colors hover-lift"
                onClick={() => {/* Could trigger search here */}}
              >
                {s}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      
      {/* LOADING STATE */}
      {loading && hasQuery && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-docseek"></div>
          <p className="text-sm text-muted-foreground mt-4">Searching documents...</p>
        </motion.div>
      )}

      
      {/* ERROR STATE */}
      {error && hasQuery && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4"
          style={{ borderColor: '#EF444433' }}
        >
          <p className="text-sm text-red-500">{error}</p>
          <p className="text-xs text-muted-foreground mt-2">
            Make sure backend is running: <code className="bg-muted px-1 rounded">python main.py</code>
          </p>
        </motion.div>
      )}

      
      {/* RESULTS - Real data from backend */}
      {realData && hasQuery && !loading && !error && (
        <AnimatePresence mode="wait">
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            
            {/* Result count + time */}
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {realData.sources.length} sources found
              </p>
              <p className="text-xs text-muted-foreground">
                {realData.time_ms}ms
              </p>
            </div>

            
            {/* MAIN ANSWER CARD */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-4 mb-4"
              style={{ borderColor: getConfidenceColor(realData.signal).border + '33' }}
            >
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Answer
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    {realData.signal_icon}
                  </span>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-md"
                    style={{
                      background: getConfidenceColor(realData.signal).bg,
                      color: getConfidenceColor(realData.signal).text
                    }}
                  >
                    {(realData.confidence * 100).toFixed(1)}% confidence
                  </span>
                </div>
              </div>
              
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {realData.answer}
              </p>
            </motion.div>

            
            {/* SOURCES LIST */}
            {realData.sources && realData.sources.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Sources ({realData.sources.length})
                </p>
                
                {realData.sources.map((source, i) => {
                  const colors = getConfidenceColor(source.signal);
                  const isExpanded = selectedSourceIndex === i;
                  
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05, type: "spring", stiffness: 300, damping: 30 }}
                      onClick={() => setSelectedSourceIndex(isExpanded ? null : i)}
                      className="glass-card p-4 cursor-pointer hover-lift"
                      style={{ borderColor: colors.border + '33' }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">
                          {source.signal === "GREEN" && "🟢"}
                          {source.signal === "YELLOW" && "🟡"}
                          {source.signal === "RED" && "🔴"}
                        </span>
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-foreground truncate">
                            {source.filename}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-muted-foreground">
                              Page {source.page}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {source.oem_code}
                            </span>
                          </div>
                        </div>
                        
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap"
                          style={{ background: colors.bg, color: colors.text }}
                        >
                          {(source.score * 100).toFixed(1)}%
                        </span>
                      </div>
                      
                      {/* Expanded info - could add more details here */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 pt-4 border-t" style={{ borderColor: colors.border + '33' }}>
                              <p className="text-xs text-muted-foreground">
                                Click to open document (feature coming soon)
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            )}
            
          </motion.div>
        </AnimatePresence>
      )}

      
      {/* EMPTY STATE */}
      {!hasQuery && (
        <p className="text-center text-sm text-muted-foreground mt-8">
          Start by asking a question about your documents.
        </p>
      )}
      
    </div>
  );
};

export default DocSeekView;