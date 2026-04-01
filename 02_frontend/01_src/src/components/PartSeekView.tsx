/**
 * PartSeekView.tsx - Part Search View Component
 *
 * Shows search results with confidence scores
 * Connected to real backend API
 *
 * Version: rev07_002
 * Branch:  main_sia08
 * Date:    27.03.2026 21:10
 * Status:  Connected to real API - NO MOCK DATA
 */

import React, { useMemo, useState } from 'react';
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
  dim_d?: string | null;
  dim_l?: string | null;
  dim_dk?: string | null;
  dim_k?: string | null;
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

type FocusTrack = 'FASTENER' | 'BRACKET' | 'OEM_NORM';

type FocusLeaf = {
  key: string;
  label: string;
  token: string;
};

type FocusBranch = {
  key: string;
  label: string;
  hint: string;
  leaves: FocusLeaf[];
};

const TRACK_TREE: Record<FocusTrack, FocusBranch[]> = {
  FASTENER: [
    {
      key: 'thread',
      label: 'Thread size',
      hint: 'Choose a thread class',
      leaves: [
        { key: 'm6', label: 'M6', token: 'm6 screw fastener' },
        { key: 'm8', label: 'M8', token: 'm8 screw fastener' },
        { key: 'm10', label: 'M10', token: 'm10 screw fastener' },
        { key: 'm12', label: 'M12', token: 'm12 screw fastener' },
        { key: 'm16', label: 'M16', token: 'm16 screw fastener' },
      ],
    },
    {
      key: 'strength',
      label: 'Strength class',
      hint: 'Choose a class',
      leaves: [
        { key: '8.8', label: '8.8', token: 'screw strength class 8.8' },
        { key: '10.9', label: '10.9', token: 'screw strength class 10.9' },
        { key: '12.9', label: '12.9', token: 'screw strength class 12.9' },
      ],
    },
    {
      key: 'drive',
      label: 'Driver type',
      hint: 'Choose head driver',
      leaves: [
        { key: 'torx', label: 'Torx', token: 'torx driver screw fastener' },
        { key: 'hex', label: 'Hex', token: 'hex driver screw fastener' },
        { key: 'innensechskant', label: 'Innensechskant', token: 'innensechskant screw fastener' },
      ],
    },
    {
      key: 'coating',
      label: 'Coating',
      hint: 'Choose coating type',
      leaves: [
        { key: 'zinc', label: 'Zinc', token: 'zinc coated screw fastener' },
        { key: 'ktl', label: 'KTL', token: 'ktl coated screw fastener' },
        { key: 'geomet', label: 'Geomet', token: 'geomet coated screw fastener' },
      ],
    },
    {
      key: 'self-locking',
      label: 'Self-locking',
      hint: 'Choose locking behavior',
      leaves: [
        { key: 'microcapsule', label: 'Micro-encapsulated', token: 'micro encapsulated self locking screw' },
        { key: 'prevailing-torque', label: 'Prevailing torque', token: 'prevailing torque self locking screw' },
        { key: 'no-lock', label: 'No self-locking', token: 'standard screw no self locking' },
      ],
    },
  ],
  BRACKET: [
    {
      key: 'shape',
      label: 'Shape',
      hint: 'Choose bracket shape',
      leaves: [
        { key: 'l-shape-with-holes', label: 'L-shape with holes', token: 'l-shape bracket with holes' },
        { key: 'l-shape-without-holes', label: 'L-shape without holes', token: 'l-shape bracket without holes' },
      ],
    },
    {
      key: 'clip',
      label: 'Clip type',
      hint: 'Choose clip behavior',
      leaves: [
        { key: 'spring', label: 'Spring clip', token: 'spring clip bracket' },
        { key: 'fixed', label: 'Fixed clip', token: 'fixed clip bracket' },
      ],
    },
  ],
  OEM_NORM: [
    {
      key: 'norm-family',
      label: 'Norm family',
      hint: 'Select norm type',
      leaves: [
        { key: 'mbn', label: 'MBN', token: 'mbn fastener norm requirements' },
        { key: 'din', label: 'DIN', token: 'din fastener norm requirements' },
        { key: 'iso', label: 'ISO', token: 'iso fastener norm requirements' },
      ],
    },
    {
      key: 'oem',
      label: 'OEM',
      hint: 'Choose OEM family',
      leaves: [
        { key: 'oem-g', label: 'OEM-G', token: 'oem-g fastener norm' },
        { key: 'oem-m', label: 'OEM-M', token: 'oem-m fastener norm' },
        { key: 'oem-z', label: 'OEM-Z', token: 'oem-z fastener norm' },
      ],
    },
  ],
};

function inferTrack(query: string): FocusTrack | null {
  const q = query.toLowerCase();
  if (/(mbn|din|iso|norm|standard)/.test(q)) return 'OEM_NORM';
  if (/(bracket|clip|l-shape|halter|winkel)/.test(q)) return 'BRACKET';
  if (/(screw|bolt|fastener|thread|m6|m8|m10|m12|m16|torx|hex|innensechskant|strength|8\.8|10\.9|12\.9)/.test(q)) return 'FASTENER';
  return null;
}

function inferBranchKey(track: FocusTrack, query: string): string | null {
  const q = query.toLowerCase();
  if (track === 'FASTENER') {
    if (/(m6|m8|m10|m12|m16|thread)/.test(q)) return 'thread';
    if (/(8\.8|10\.9|12\.9|strength|class)/.test(q)) return 'strength';
    if (/(torx|hex|innensechskant|drive)/.test(q)) return 'drive';
    if (/(zinc|zink|ktl|geomet|coating)/.test(q)) return 'coating';
    if (/(self lock|self-lock|micro|prevailing torque|locking)/.test(q)) return 'self-locking';
  }
  if (track === 'BRACKET') {
    if (/(l-shape|holes|without holes|shape|winkel)/.test(q)) return 'shape';
    if (/(clip|spring|fixed)/.test(q)) return 'clip';
  }
  if (track === 'OEM_NORM') {
    if (/(mbn|din|iso|norm)/.test(q)) return 'norm-family';
    if (/(oem-g|oem-m|oem-z|mercedes|gm|volvo)/.test(q)) return 'oem';
  }
  return null;
}

function inferLeaf(track: FocusTrack, branchKey: string, query: string): FocusLeaf | null {
  const branch = TRACK_TREE[track].find((item) => item.key === branchKey);
  if (!branch) return null;
  const q = query.toLowerCase();

  const keyMap: Record<string, RegExp> = {
    m6: /\bm6\b/,
    m8: /\bm8\b/,
    m10: /\bm10\b/,
    m12: /\bm12\b/,
    m16: /\bm16\b/,
    '8.8': /\b8\.8\b/,
    '10.9': /\b10\.9\b/,
    '12.9': /\b12\.9\b/,
    torx: /torx/,
    hex: /\bhex\b/,
    innensechskant: /innensechskant/,
    zinc: /zinc|zink/,
    ktl: /ktl/,
    geomet: /geomet/,
    microcapsule: /micro/,
    'prevailing-torque': /prevailing torque/,
    'no-lock': /no self locking|no self-locking/,
    'l-shape-with-holes': /l-shape.*holes|with holes/,
    'l-shape-without-holes': /l-shape.*without holes|without holes/,
    spring: /spring/,
    fixed: /fixed/,
    mbn: /\bmbn\b/,
    din: /\bdin\b/,
    iso: /\biso\b/,
    'oem-g': /oem-g|mercedes/,
    'oem-m': /oem-m|\bgm\b/,
    'oem-z': /oem-z|volvo/,
  };

  const matched = branch.leaves.find((leaf) => {
    const matcher = keyMap[leaf.key];
    return matcher ? matcher.test(q) : false;
  });

  return matched ?? null;
}

function getTrackCategory(track: FocusTrack): string {
  if (track === 'FASTENER') return 'Supplier-Fastener';
  if (track === 'BRACKET') return 'Bracket';
  return 'OEM-Fastener';
}

const PartSeekView: React.FC<PartSeekViewProps> = ({ query }) => {
  const [dragOver, setDragOver]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [apiData, setApiData]     = useState<ApiResponse | null>(null);
  const [lastQuery, setLastQuery] = useState('');
  const [hasInitialRequest, setHasInitialRequest] = useState(false);
  const [hasImageUpload, setHasImageUpload] = useState(false);
  const [showCollapsedIcon, setShowCollapsedIcon] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<FocusTrack | null>(null);
  const [selectedBranchKey, setSelectedBranchKey] = useState<string | null>(null);
  const [selectedLeaf, setSelectedLeaf] = useState<FocusLeaf | null>(null);
  const normalizedQuery = query.trim();
  const hasQuery = normalizedQuery.length > 0;
  const showRefineArea = hasInitialRequest && (hasQuery || hasImageUpload);

  const effectiveQuery = useMemo(() => {
    if (!hasQuery) return '';
    const parts: string[] = [normalizedQuery];
    if (selectedLeaf?.token) {
      const base = normalizedQuery.toLowerCase();
      const token = selectedLeaf.token.toLowerCase();
      if (!base.includes(token)) {
        parts.push(selectedLeaf.token);
      }
    }
    return parts.join(' ').trim();
  }, [hasQuery, normalizedQuery, selectedLeaf]);

  const level2Branches = useMemo(() => {
    if (!selectedTrack) return [] as FocusBranch[];
    return TRACK_TREE[selectedTrack];
  }, [selectedTrack]);

  const selectedBranch = useMemo(() => {
    if (!selectedBranchKey) return null;
    return level2Branches.find((b) => b.key === selectedBranchKey) ?? null;
  }, [level2Branches, selectedBranchKey]);

  const completedSteps =
    (selectedTrack ? 1 : 0) +
    (selectedBranchKey ? 1 : 0) +
    (selectedLeaf ? 1 : 0);

  const canGoBackStep = completedSteps > 0;
  const canGoForwardStep = completedSteps < 3;

  const handleBackStep = () => {
    if (selectedLeaf) {
      setSelectedLeaf(null);
    } else if (selectedBranchKey) {
      setSelectedBranchKey(null);
      setSelectedLeaf(null);
    } else if (selectedTrack) {
      setSelectedTrack(null);
      setSelectedBranchKey(null);
      setSelectedLeaf(null);
    }
    setApiData(null);
    setLastQuery('');
  };

  const handleForwardStep = () => {
    if (!selectedTrack) {
      setSelectedTrack('FASTENER');
      setSelectedBranchKey(null);
      setSelectedLeaf(null);
    } else if (!selectedBranchKey) {
      const firstBranch = TRACK_TREE[selectedTrack][0];
      setSelectedBranchKey(firstBranch?.key ?? null);
      setSelectedLeaf(null);
    } else if (!selectedLeaf) {
      const branch = TRACK_TREE[selectedTrack].find((b) => b.key === selectedBranchKey);
      const firstLeaf = branch?.leaves?.[0] ?? null;
      setSelectedLeaf(firstLeaf);
    }
    setApiData(null);
    setLastQuery('');
  };

  React.useEffect(() => {
    if (!hasQuery) return;
    const inferredTrack = inferTrack(normalizedQuery);
    const inferredBranch = inferredTrack ? inferBranchKey(inferredTrack, normalizedQuery) : null;
    const inferredLeaf = inferredTrack && inferredBranch ? inferLeaf(inferredTrack, inferredBranch, normalizedQuery) : null;
    setSelectedTrack(inferredTrack);
    setSelectedBranchKey(inferredBranch);
    setSelectedLeaf(inferredLeaf);
    setApiData(null);
    setLastQuery('');
  }, [query]);

  React.useEffect(() => {
    // If user clears all search input, return fully to the initial upload state.
    if (!hasQuery) {
      setSelectedTrack(null);
      setSelectedBranchKey(null);
      setSelectedLeaf(null);
      setApiData(null);
      setLastQuery('');
      setLoading(false);
      setHasImageUpload(false);
      setHasInitialRequest(false);
      setShowCollapsedIcon(false);
    }
  }, [hasQuery]);

  React.useEffect(() => {
    // Keep the upload-area collapse behavior independent from track selection.
    setHasInitialRequest(hasQuery || hasImageUpload);
  }, [hasQuery, hasImageUpload]);

  React.useEffect(() => {
    if (!showRefineArea) {
      setShowCollapsedIcon(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setShowCollapsedIcon(true);
    }, 1200);

    return () => window.clearTimeout(timer);
  }, [showRefineArea]);

  // Fetch from API when query changes
  React.useEffect(() => {
    if (!hasQuery || !effectiveQuery || !selectedTrack || !selectedLeaf || effectiveQuery === lastQuery) return;

    const timer = window.setTimeout(() => {
      setHasInitialRequest(true);
      setLastQuery(effectiveQuery);
      setLoading(true);
      setApiData(null);

      const body = {
        question: effectiveQuery,
        module: 'partseek',
        // Keep retrieval broad for fastener/bracket and rely on track filters.
        // Category hard-filters can remove valid candidates (e.g. M10 across mixed metadata labels).
        category: selectedTrack === 'OEM_NORM' ? getTrackCategory(selectedTrack) : undefined,
      };

      fetch(`${API_URL}/api/partseek/query`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      })
        .then(r => r.json())
        .then(data => {
          setApiData(data as ApiResponse);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }, 350);

    return () => window.clearTimeout(timer);
  }, [hasQuery, effectiveQuery, lastQuery, selectedTrack]);

  const showTrackSwitch = hasQuery && !selectedTrack;
  const showBranchSwitch = hasQuery && !!selectedTrack && !selectedBranchKey;
  const showLeafSwitch = hasQuery && !!selectedTrack && !!selectedBranchKey && !selectedLeaf;
  const results = apiData?.results ?? [];
  return (
    <div className="w-full max-w-2xl mx-auto mt-4">

      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 180, damping: 34, mass: 0.95 }}
        className="mb-5"
      >
        <div className="relative">
          <motion.div
            layout
            transition={{ duration: 1.2, ease: [0.22, 0.61, 0.36, 1] }}
            className={`rounded-xl border-2 border-dashed text-center ${dragOver ? 'scale-[1.01]' : ''} w-full overflow-hidden relative ${showRefineArea ? 'py-0.5 px-3' : 'p-6'}`}
            style={{
              minHeight: showRefineArea ? 37 : 116,
              borderColor: showRefineArea ? '#6B728055' : (dragOver ? '#0EA5E9' : '#0EA5E966'),
              background: showRefineArea ? 'transparent' : (dragOver ? '#0EA5E90F' : 'transparent'),
              zIndex: 2,
            }}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => {
              e.preventDefault();
              setDragOver(false);
              setHasImageUpload(true);
              setHasInitialRequest(true);
            }}
          >
            <motion.div
              animate={{ x: showRefineArea ? 0 : 0 }}
              transition={{ duration: 1.2, ease: [0.22, 0.61, 0.36, 1] }}
              className={`flex ${showRefineArea ? 'justify-end items-center min-h-[37px] pr-1' : 'justify-center items-center flex-col'}`}
            >
              {!showRefineArea && (
                <>
                  <Upload size={20} className="mx-auto mb-2" style={{ color: '#0EA5E9' }} />
                  <p className="text-xs" style={{ color: '#0EA5E9' }}>Or upload a photo of the part</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Drag and drop or click to browse</p>
                </>
              )}

              {showRefineArea && showCollapsedIcon && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.75, ease: [0.22, 0.61, 0.36, 1] }}
                  className="flex items-center gap-2"
                >
                  <span className="text-[10px]" style={{ color: '#9CA3AF' }}>
                    Clear search info to activate upload window
                  </span>
                  <Upload size={18} style={{ color: '#9CA3AF' }} />
                </motion.div>
              )}
            </motion.div>
          </motion.div>

        </div>
      </motion.div>

      {hasQuery && (
        <div className="mb-4 rounded-xl p-3" style={{ border: '1px solid #0EA5E933', background: '#0EA5E90D' }}>
          <div className="flex items-start justify-between mb-2">
            <p className="text-xs font-semibold" style={{ color: '#0EA5E9' }}>
              Focus track (Gleis): choose search intent before final retrieval
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleBackStep}
                disabled={!canGoBackStep}
                className="h-6 w-6 rounded-md border text-xs font-bold"
                style={{
                  borderColor: canGoBackStep ? '#0EA5E966' : '#6B728044',
                  color: canGoBackStep ? '#0EA5E9' : '#6B7280',
                  background: canGoBackStep ? '#0EA5E914' : 'transparent',
                  cursor: canGoBackStep ? 'pointer' : 'not-allowed',
                }}
                aria-label="Back step"
                title="Back"
              >
                {'<'}
              </button>
              <button
                type="button"
                onClick={handleForwardStep}
                disabled={!canGoForwardStep}
                className="h-6 w-6 rounded-md border text-xs font-bold"
                style={{
                  borderColor: canGoForwardStep ? '#0EA5E966' : '#6B728044',
                  color: canGoForwardStep ? '#0EA5E9' : '#6B7280',
                  background: canGoForwardStep ? '#0EA5E914' : 'transparent',
                  cursor: canGoForwardStep ? 'pointer' : 'not-allowed',
                }}
                aria-label="Next step"
                title="Next"
              >
                {'>'}
              </button>
            </div>
          </div>
          {showTrackSwitch && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                setSelectedTrack('FASTENER');
                setSelectedBranchKey(null);
                setSelectedLeaf(null);
                setApiData(null);
                setLastQuery('');
              }}
              className="rounded-md border px-3 py-2 text-xs text-left"
              style={{
                borderColor: selectedTrack === 'FASTENER' ? '#0EA5E9' : '#0EA5E944',
                background: selectedTrack === 'FASTENER' ? '#0EA5E922' : 'transparent',
                color: selectedTrack === 'FASTENER' ? '#0EA5E9' : '#C7CDD6',
              }}
            >
              FASTENER · Supplier fasteners
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedTrack('BRACKET');
                setSelectedBranchKey(null);
                setSelectedLeaf(null);
                setApiData(null);
                setLastQuery('');
              }}
              className="rounded-md border px-3 py-2 text-xs text-left"
              style={{
                borderColor: selectedTrack === 'BRACKET' ? '#0EA5E9' : '#0EA5E944',
                background: selectedTrack === 'BRACKET' ? '#0EA5E922' : 'transparent',
                color: selectedTrack === 'BRACKET' ? '#0EA5E9' : '#C7CDD6',
              }}
            >
              BRACKET · Mounting parts
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedTrack('OEM_NORM');
                setSelectedBranchKey(null);
                setSelectedLeaf(null);
                setApiData(null);
                setLastQuery('');
              }}
              className="rounded-md border px-3 py-2 text-xs text-left"
              style={{
                borderColor: selectedTrack === 'OEM_NORM' ? '#0EA5E9' : '#0EA5E944',
                background: selectedTrack === 'OEM_NORM' ? '#0EA5E922' : 'transparent',
                color: selectedTrack === 'OEM_NORM' ? '#0EA5E9' : '#C7CDD6',
              }}
            >
              OEM NORM · OEM fastener standards
            </button>
            </div>
          )}

          {showBranchSwitch && selectedTrack && (
            <div className="mt-3 rounded-lg border p-3" style={{ borderColor: '#0EA5E944' }}>
              <p className="text-[11px] font-semibold mb-2" style={{ color: '#0EA5E9' }}>
                Level 2: choose one category
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {level2Branches.map((branch) => (
                  <button
                    key={branch.key}
                    type="button"
                    onClick={() => {
                      setSelectedBranchKey(branch.key);
                      setSelectedLeaf(null);
                      setApiData(null);
                      setLastQuery('');
                    }}
                    className="rounded-md border px-3 py-2 text-left"
                    style={{
                      borderColor: selectedBranchKey === branch.key ? '#0EA5E9' : '#0EA5E944',
                      background: selectedBranchKey === branch.key ? '#0EA5E922' : 'transparent',
                    }}
                  >
                    <p className="text-xs font-semibold" style={{ color: selectedBranchKey === branch.key ? '#0EA5E9' : '#C7CDD6' }}>
                      {branch.label}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{branch.hint}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {showLeafSwitch && selectedBranch && (
            <div className="mt-3 rounded-lg border p-3" style={{ borderColor: '#0EA5E944' }}>
              <p className="text-[11px] font-semibold mb-2" style={{ color: '#0EA5E9' }}>
                Level 3: choose specific filter
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {selectedBranch.leaves.map((leaf) => (
                  <button
                    key={leaf.key}
                    type="button"
                    onClick={() => {
                      setSelectedLeaf(leaf);
                      setApiData(null);
                      setLastQuery('');
                    }}
                    className="rounded-md border px-3 py-2 text-xs text-left"
                    style={{
                      borderColor: selectedLeaf?.key === leaf.key ? '#0EA5E9' : '#0EA5E944',
                      background: selectedLeaf?.key === leaf.key ? '#0EA5E922' : 'transparent',
                      color: selectedLeaf?.key === leaf.key ? '#0EA5E9' : '#C7CDD6',
                    }}
                  >
                    {leaf.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-3 pt-3 border-t" style={{ borderColor: '#0EA5E933' }}>
            <p className="text-[11px] font-semibold mb-2" style={{ color: '#0EA5E9' }}>
              Active setup
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="text-[10px] px-2 py-1 rounded-md" style={{ background: '#0EA5E91A', color: '#0EA5E9', border: '1px solid #0EA5E933' }}>
                Track: {selectedTrack ?? 'open'}
              </span>
              <span className="text-[10px] px-2 py-1 rounded-md" style={{ background: '#0EA5E91A', color: '#0EA5E9', border: '1px solid #0EA5E933' }}>
                Category: {selectedBranch?.label ?? 'open'}
              </span>
              <span className="text-[10px] px-2 py-1 rounded-md" style={{ background: '#0EA5E91A', color: '#0EA5E9', border: '1px solid #0EA5E933' }}>
                Detail: {selectedLeaf?.label ?? 'open'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center gap-2 py-8">
          <Loader2 size={18} className="animate-spin" style={{ color: '#0EA5E9' }} />
          <span className="text-xs" style={{ color: '#0EA5E9' }}>
            Searching parts...
          </span>
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
                          <div className="flex justify-between col-span-2">
                            <span style={{ color }}>d</span>
                            <span className="text-gray-300 font-medium">{part.dim_d ?? part.thread_size ?? 'N/A'}</span>
                          </div>
                          <div className="flex justify-between col-span-2">
                            <span style={{ color }}>l</span>
                            <span className="text-gray-300 font-medium">{part.dim_l ?? 'N/A'}</span>
                          </div>
                          <div className="flex justify-between col-span-2">
                            <span style={{ color }}>dk</span>
                            <span className="text-gray-300 font-medium">{part.dim_dk ?? 'N/A'}</span>
                          </div>
                          <div className="flex justify-between col-span-2">
                            <span style={{ color }}>k</span>
                            <span className="text-gray-300 font-medium">{part.dim_k ?? 'N/A'}</span>
                          </div>
                          {part.strength_class && (
                            <div className="flex justify-between col-span-2">
                              <span style={{ color }}>Class</span>
                              <span className="text-gray-300 font-medium">{part.strength_class}</span>
                            </div>
                          )}
                          {part.drive_type && (
                            <div className="flex justify-between col-span-2">
                              <span style={{ color }}>Driver</span>
                              <span className="text-gray-300 font-medium">{part.drive_type}</span>
                            </div>
                          )}
                          {part.coating && (
                            <div className="flex justify-between col-span-2">
                              <span style={{ color }}>Coating</span>
                              <span className="text-gray-300 font-medium">{part.coating}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right — Details */}
                      <div className="sm:w-3/5 p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-sm font-bold text-gray-300">
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
                              <span className="text-gray-300">{part.strength_class}</span>
                            </div>
                          )}
                          {part.drive_type && (
                            <div className="flex gap-2">
                              <span className="text-muted-foreground w-20">Driver</span>
                              <span className="text-gray-300">{part.drive_type}</span>
                            </div>
                          )}
                          {part.coating && (
                            <div className="flex gap-2">
                              <span className="text-muted-foreground w-20">Coating</span>
                              <span className="text-gray-300">{part.coating}</span>
                            </div>
                          )}
                          {part.self_locking && (
                            <div className="flex gap-2">
                              <span className="text-muted-foreground w-20">Self-lock</span>
                              <span className="text-gray-300">✅ Yes</span>
                            </div>
                          )}
                          <div className="flex gap-2">
                            <span className="text-muted-foreground w-20">Score</span>
                            <span className="text-gray-300 font-medium">
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
          🔴 No parts found for "{normalizedQuery}" — try different search terms.
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
