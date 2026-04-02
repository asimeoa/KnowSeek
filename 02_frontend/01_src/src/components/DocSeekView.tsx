/**
 * DocSeekView.tsx - Document Search View Component
 *
 * 3-level query refinement flow for DocSeek:
 * Category -> OEM -> Intent
 *
 * Uses query analysis to preselect switches and only shows unresolved steps.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { askDocSeek, compareDocSeek, type DocSeekResponse, type DocSeekCompareResponse } from '@/lib/api';

interface DocSeekViewProps {
  onSearch: (query: string) => void;
  query: string;
}

type DocCategory = 'Corrosion' | 'Painting' | 'General';
type DocOem = 'ALL' | 'GM' | 'MB' | 'Volvo' | 'DIN' | 'China';
type DocIntent = 'REQUIREMENT' | 'COMPARE' | 'STANDARD';

const CATEGORY_OPTIONS: Array<{ key: DocCategory; label: string; chunks: number }> = [
  { key: 'Corrosion', label: 'Corrosion', chunks: 55 },
  { key: 'Painting', label: 'Painting', chunks: 19 },
  { key: 'General', label: 'General', chunks: 19 },
];

const OEM_OPTIONS: Array<{ key: DocOem; label: string; sub: string; chunks: number }> = [
  { key: 'ALL',   label: 'All OEMs',  sub: 'General',       chunks: 51 },
  { key: 'GM',    label: 'GM',        sub: 'General Motors', chunks: 14 },
  { key: 'MB',    label: 'MB',        sub: 'Mercedes',       chunks: 7  },
  { key: 'Volvo', label: 'Volvo',     sub: 'Volvo Cars',     chunks: 8  },
  { key: 'DIN',   label: 'DIN',       sub: 'Norm',           chunks: 6  },
];

const INTENT_OPTIONS: Array<{ key: DocIntent; label: string }> = [
  { key: 'REQUIREMENT', label: 'Find requirement' },
  { key: 'COMPARE', label: 'Compare OEMs' },
  { key: 'STANDARD', label: 'Find standard / norm' },
];

function inferCategory(query: string): DocCategory | null {
  const q = query.toLowerCase();
  if (/(corrosion|korrosion|salt spray|rust|rost)/.test(q)) return 'Corrosion';
  if (/(painting|paint|coating|lack|beschichtung|ktl|zinc|zink)/.test(q)) return 'Painting';
  if (/(standard|norm|din|iso|vda|requirement|anforderung)/.test(q)) return 'General';
  return null;
}

function inferOem(query: string): DocOem | null {
  const q = query.toLowerCase();
  if (/(all oems|all oem|general)/.test(q)) return 'ALL';
  if (/(\bgm\b|general motors)/.test(q)) return 'GM';
  if (/(\bmb\b|mercedes|mbn)/.test(q)) return 'MB';
  if (/(volvo|vcs)/.test(q)) return 'Volvo';
  if (/(\bdin\b|norm)/.test(q)) return 'DIN';
  if (/(china)/.test(q)) return 'China';
  return null;
}

function inferIntent(query: string): DocIntent | null {
  const q = query.toLowerCase();
  if (/(compare|comparison|vergleich)/.test(q)) return 'COMPARE';
  if (/(standard|norm|din|iso|vda)/.test(q)) return 'STANDARD';
  if (/(requirement|criteria|duration|anforderung)/.test(q)) return 'REQUIREMENT';
  return null;
}

function mergeCompareResult(topic: string, data: DocSeekCompareResponse): DocSeekResponse {
  const entries = Object.entries(data || {});
  const sorted = entries.sort((a, b) => (b[1]?.confidence ?? 0) - (a[1]?.confidence ?? 0));

  const signalPriority: Record<string, number> = { GREEN: 3, YELLOW: 2, RED: 1 };
  const bestSignal = sorted
    .map(([, value]) => value?.signal ?? 'RED')
    .sort((a, b) => signalPriority[b] - signalPriority[a])[0] ?? 'RED';

  const answer = sorted
    .map(([oem, value]) => `${oem}: ${value?.answer ?? 'No result'}`)
    .join('\n\n');

  const sources = sorted.flatMap(([, value]) => value?.sources ?? []).slice(0, 6);
  const confidence = sorted.length ? Math.max(...sorted.map(([, value]) => value?.confidence ?? 0)) : 0;
  const time_ms = sorted.reduce((sum, [, value]) => sum + (value?.time_ms ?? 0), 0);
  const signal_icon = bestSignal === 'GREEN' ? '🟢' : bestSignal === 'YELLOW' ? '🟡' : '🔴';

  return {
    question: topic,
    answer,
    confidence,
    signal: bestSignal,
    signal_icon,
    sources,
    time_ms,
  };
}

const DocSeekView: React.FC<DocSeekViewProps> = ({ query, onSearch }) => {
  // ─────────────────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────────────────
  
  const [selectedSourceIndex, setSelectedSourceIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [realData, setRealData] = useState<DocSeekResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastRequestKey, setLastRequestKey] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DocCategory | null>(null);
  const [selectedOem, setSelectedOem] = useState<DocOem | null>(null);
  const [selectedIntent, setSelectedIntent] = useState<DocIntent | null>(null);
  
  const [recentSearches] = useState<string[]>([
    "Salt spray test requirements",
    "Corrosion protection standards",
    "Coating thickness requirements",
    "DIN EN ISO standards",
  ]);

  
  // ─────────────────────────────────────────────────────
  // API CALL - When query changes
  // ─────────────────────────────────────────────────────
  
  useEffect(() => {
    if (!query.length) {
      setSelectedCategory(null);
      setSelectedOem(null);
      setSelectedIntent(null);
      setRealData(null);
      setError(null);
      setLoading(false);
      setLastRequestKey('');
      return;
    }

    setSelectedCategory(inferCategory(query));
    setSelectedOem(inferOem(query));
    setSelectedIntent(inferIntent(query));
    setRealData(null);
    setError(null);
    setLoading(false);
    setLastRequestKey('');
    setSelectedSourceIndex(null);
  }, [query]);

  useEffect(() => {
    if (!query.length || !selectedCategory || !selectedOem || !selectedIntent) return;

    const requestKey = JSON.stringify({
      query,
      category: selectedCategory,
      oem: selectedOem,
      intent: selectedIntent,
    });

    if (requestKey === lastRequestKey) return;

    setLoading(true);
    setError(null);
    setSelectedSourceIndex(null);
    setLastRequestKey(requestKey);

    const refinedTopic = [query, selectedCategory !== 'General' ? selectedCategory : null]
      .filter(Boolean)
      .join(' ')
      .trim();

    const run = async () => {
      try {
        if (selectedIntent === 'COMPARE') {
          const oemCodes = selectedOem === 'ALL' ? ['OEM-G', 'OEM-M', 'OEM-Z'] : [selectedOem];
          const compareData = await compareDocSeek({ topic: refinedTopic || query, oem_codes: oemCodes });
          setRealData(mergeCompareResult(refinedTopic || query, compareData));
        } else {
          const response = await askDocSeek({
            question: refinedTopic || query,
            category: selectedCategory,
            oem_code: selectedOem === 'ALL' ? undefined : selectedOem,
          });
          setRealData(response);
        }
      } catch (err) {
        console.error('API Error:', err);
        setError('Failed to connect to backend. Is it running on port 8001?');
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [query, selectedCategory, selectedOem, selectedIntent, lastRequestKey]);

  
  // ─────────────────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────────────────
  
  const hasQuery = query.length > 0;
  const showCategorySwitch = hasQuery && !selectedCategory;
  const showOemSwitch = hasQuery && !!selectedCategory && !selectedOem;
  const showIntentSwitch = hasQuery && !!selectedCategory && !!selectedOem && !selectedIntent;

  const whereFilter = selectedCategory
    ? selectedOem && selectedOem !== 'ALL'
      ? `{"$and": [{"module":"docseek"}, {"category":"${selectedCategory}"}, {"oem_code":"${selectedOem}"}]}`
      : `{"$and": [{"module":"docseek"}, {"category":"${selectedCategory}"}]}`
    : 'n/a';

  const compareBody = selectedOem === 'ALL' ? '["OEM-G","OEM-M","OEM-Z"]' : selectedOem ? `["${selectedOem}"]` : '[]';

  const completedSwitches =
    (selectedCategory ? 1 : 0) +
    (selectedOem ? 1 : 0) +
    (selectedIntent ? 1 : 0);

  const canGoBack = completedSwitches > 0;
  const canGoForward = completedSwitches < 3;

  const handleBack = () => {
    if (selectedIntent) {
      setSelectedIntent(null);
    } else if (selectedOem) {
      setSelectedOem(null);
      setSelectedIntent(null);
    } else if (selectedCategory) {
      setSelectedCategory(null);
      setSelectedOem(null);
      setSelectedIntent(null);
    }
    setRealData(null);
    setLastRequestKey('');
  };

  const handleForward = () => {
    if (!selectedCategory) {
      setSelectedCategory(inferCategory(query) ?? 'Corrosion');
    } else if (!selectedOem) {
      setSelectedOem(inferOem(query) ?? 'ALL');
    } else if (!selectedIntent) {
      setSelectedIntent(inferIntent(query) ?? 'REQUIREMENT');
    }
    setRealData(null);
    setLastRequestKey('');
  };
  
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
                onClick={() => onSearch(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {hasQuery && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 glass-card p-4" style={{ borderColor: '#10B98144' }}>
          <div className="flex items-start justify-between mb-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Smart Query Steps - DocSeek
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleBack}
                disabled={!canGoBack}
                className="h-6 w-6 rounded-md border text-xs font-bold"
                style={{
                  borderColor: canGoBack ? '#10B98166' : '#6B728044',
                  color: canGoBack ? '#10B981' : '#6B7280',
                  background: canGoBack ? '#10B98114' : 'transparent',
                  cursor: canGoBack ? 'pointer' : 'not-allowed',
                }}
                aria-label="Back step"
                title="Back"
              >
                {'<'}
              </button>
              <button
                type="button"
                onClick={handleForward}
                disabled={!canGoForward}
                className="h-6 w-6 rounded-md border text-xs font-bold"
                style={{
                  borderColor: canGoForward ? '#10B98166' : '#6B728044',
                  color: canGoForward ? '#10B981' : '#6B7280',
                  background: canGoForward ? '#10B98114' : 'transparent',
                  cursor: canGoForward ? 'pointer' : 'not-allowed',
                }}
                aria-label="Next step"
                title="Next"
              >
                {'>'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 mb-3">
            <div className="text-xs text-muted-foreground">Switch 1 - Category: {selectedCategory ?? 'open'}</div>
            <div className="text-xs text-muted-foreground">Switch 2 - OEM: {selectedOem ?? 'open'}</div>
            <div className="text-xs text-muted-foreground">Switch 3 - Intent: {selectedIntent ?? 'open'}</div>
          </div>

          {showCategorySwitch && (
            <div className="mb-3">
              <p className="text-[11px] font-semibold mb-2" style={{ color: '#10B981' }}>
                SWITCH 1 - Category
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {CATEGORY_OPTIONS.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setSelectedCategory(item.key)}
                    className="rounded-md border px-3 py-2 text-left"
                    style={{ borderColor: '#10B98144', background: 'transparent' }}
                  >
                    <p className="text-xs font-semibold text-gray-300">{item.label}</p>
                    <p className="text-[10px] text-muted-foreground">{item.chunks} chunks</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {showOemSwitch && (
            <div className="mb-3">
              <p className="text-[11px] font-semibold mb-2" style={{ color: '#10B981' }}>
                SWITCH 2 - OEM
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {OEM_OPTIONS.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setSelectedOem(item.key)}
                    className="rounded-md border px-3 py-2 text-left"
                    style={{ borderColor: '#10B98144', background: 'transparent' }}
                  >
                    <p className="text-xs font-semibold text-gray-300">{item.label}</p>
                    <p className="text-[10px] text-muted-foreground">{item.sub} · {item.chunks} chunks</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {showIntentSwitch && (
            <div className="mb-2">
              <p className="text-[11px] font-semibold mb-2" style={{ color: '#10B981' }}>
                SWITCH 3 - Intent
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {INTENT_OPTIONS.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setSelectedIntent(item.key)}
                    className="rounded-md border px-3 py-2 text-left"
                    style={{ borderColor: '#10B98144', background: 'transparent' }}
                  >
                    <p className="text-xs font-semibold text-gray-300">{item.label}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedCategory && selectedOem && selectedIntent && (
            <div className="mt-3 pt-3 border-t" style={{ borderColor: '#10B98133' }}>
              <p className="text-[11px] font-semibold mb-2" style={{ color: '#10B981' }}>
                Active setup
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-[10px] px-2 py-1 rounded-md" style={{ background: '#10B9811A', color: '#10B981', border: '1px solid #10B98133' }}>
                  Category: {selectedCategory}
                </span>
                <span className="text-[10px] px-2 py-1 rounded-md" style={{ background: '#10B9811A', color: '#10B981', border: '1px solid #10B98133' }}>
                  OEM: {selectedOem}
                </span>
                <span className="text-[10px] px-2 py-1 rounded-md" style={{ background: '#10B9811A', color: '#10B981', border: '1px solid #10B98133' }}>
                  Intent: {selectedIntent}
                </span>
              </div>
            </div>
          )}
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
              
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
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
                          <p className="text-xs font-semibold text-gray-300 truncate">
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