/**
 * PartSeekView.tsx - Part Search View Component
 *
 * Shows search results with confidence scores
 * Connected to real backend API
 *
 * Version: rev09_001
 * Branch:  main_sia10
 * Date:    01.04.2026 14:42
 * Status:  Connected to real API - with real data.  
 */

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Loader2 } from 'lucide-react';
import ScrewSketch from './ScrewSketch';

interface PartResult {
  rank?: number;
  score: number;
  signal: string;
  name?: string;
  part_number?: string;
  revision?: string;
  drawing_no?: string;
  material?: string;
  surface?: string;
  fa_max?: string;
  fr_max?: string;
  dims?: {
    D?: string;
    Dk?: string;
    l?: string;
    k?: string;
  };

  oem?: string;
  part_type?: string;
  surface_color?: string;
  length?: string;
  thread?: string;

  oem_code?: string;
  oem_real?: string | null;
  category?: string;
  page?: number;
  norm?: string | null;
  thread_size?: string | null;
  dim_d?: string | null;
  dim_l?: string | null;
  dim_dk?: string | null;
  dim_k?: string | null;
  strength_class?: string | null;
  drive_type?: string | null;
  coating?: string | null;
  self_locking?: boolean;
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

function na(value: unknown): string {
  if (value === null || value === undefined) return 'N/A';
  const text = String(value).trim();
  return text.length > 0 ? text : 'N/A';
}

function isNotAvailable(value: unknown): boolean {
  return na(value).toUpperCase() === 'N/A';
}

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
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold uppercase tracking-widest text-white">
                {results.length} matching parts
              </p>
              <span className="text-[10px] text-slate-500">
                {Math.round((apiData?.confidence ?? 0) * 100)}% confidence · {apiData?.time_ms}ms
              </span>
            </div>

            <div className="space-y-4">
              {results.map((part, i) => {
                const dims = {
                  D:  part.dims?.D  ?? part.thread  ?? part.dim_d  ?? part.thread_size,
                  Dk: part.dims?.Dk ?? part.dim_dk,
                  l:  part.dims?.l  ?? part.length  ?? part.dim_l,
                  k:  part.dims?.k  ?? part.dim_k,
                };
                const oems = [part.oem, part.oem_code, part.oem_real]
                  .filter(Boolean)
                  .flatMap(v => String(v).split(/[,;/]/))
                  .map(s => s.trim())
                  .filter(s => s.length > 0 && s.toUpperCase() !== 'N/A');
                const hasFa = !isNotAvailable(part.fa_max);
                const hasFr = !isNotAvailable(part.fr_max);
                const drawingNo = na(part.drawing_no);
                const hasDrawing = drawingNo !== '—';
                const hasRevision = part.revision && part.revision.toUpperCase() !== 'N/A';

                return (
                  <motion.div
                    key={`${part.part_number ?? part.name ?? 'part'}-${i}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, type: 'spring', stiffness: 300, damping: 30 }}
                    className="rounded-2xl overflow-hidden"
                    style={{ background: '#0D1B2A', border: '1px solid #1A314F' }}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr]">

                      {/* Left: sketch + legend */}
                      <div className="p-5 border-b lg:border-b-0 lg:border-r" style={{ borderColor: '#1A314F' }}>
                        <ScrewSketch dims={dims} />
                      </div>

                      {/* Right: part details */}
                      <div className="p-5 flex flex-col gap-4">

                        {/* Name + drawing link */}
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-base font-bold text-white leading-tight">
                              {na(part.name)}
                            </h3>
                            <p className="text-sm mt-1" style={{ color: '#6B7E99' }}>
                              {na(part.part_number)}
                              {hasRevision ? ` · Rev. ${part.revision}` : ''}
                            </p>
                          </div>
                          {hasDrawing ? (
                            <a
                              href={`#${drawingNo}`}
                              className="text-[11px] shrink-0 mt-0.5 font-mono hover:underline"
                              style={{ color: '#3B82F6' }}
                              title="Open drawing"
                            >
                              {drawingNo}
                            </a>
                          ) : (
                            <span className="text-[11px] shrink-0 mt-0.5 font-mono" style={{ color: '#4B5563' }}>n/a</span>
                          )}
                        </div>

                        {/* Properties */}
                        <div className="flex flex-col gap-2.5">
                          {[
                            { label: 'Material', value: na(part.material) },
                            { label: 'Surface',  value: na(part.surface ?? part.surface_color) },
                            { label: 'Strength', value: na(part.strength_class) },
                          ].map(({ label, value }) => (
                            <div key={label} className="flex items-baseline justify-between gap-4">
                              <span className="text-sm shrink-0" style={{ color: '#6B7E99' }}>{label}</span>
                              {value === '—'
                                ? <span className="text-sm text-right" style={{ color: '#4B5563' }}>n/a</span>
                                : <span className="text-sm text-right text-slate-200">{value}</span>
                              }
                            </div>
                          ))}
                          <div className="flex items-baseline justify-between gap-4">
                            <span className="text-sm shrink-0" style={{ color: '#6B7E99' }}>Fa max</span>
                            {hasFa
                              ? <span className="text-sm text-right font-bold text-white">{na(part.fa_max)}</span>
                              : <span className="text-sm text-right" style={{ color: '#4B5563' }}>n/a</span>
                            }
                          </div>
                          <div className="flex items-baseline justify-between gap-4">
                            <span className="text-sm shrink-0" style={{ color: '#6B7E99' }}>Fr max</span>
                            {hasFr
                              ? <span className="text-sm text-right font-bold text-white">{na(part.fr_max)}</span>
                              : <span className="text-sm text-right" style={{ color: '#4B5563' }}>n/a</span>
                            }
                          </div>
                        </div>

                        {/* OEM pills */}
                        {oems.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {oems.map(oem => (
                              <span
                                key={oem}
                                className="px-3 py-0.5 rounded-full text-xs font-semibold"
                                style={{ border: '1px solid #3B82F6', color: '#3B82F6', background: '#3B82F610' }}
                              >
                                {oem}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Footer — Phase 2 placeholders */}
                        <div className="flex items-center gap-5 pt-1 mt-auto opacity-35" title="Coming in Phase 2">
                          <span className="flex items-center gap-1.5 text-xs cursor-not-allowed" style={{ color: '#4B5563' }}>
                            📁 Used in projects
                          </span>
                          <span className="flex items-center gap-1.5 text-xs cursor-not-allowed" style={{ color: '#4B5563' }}>
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
