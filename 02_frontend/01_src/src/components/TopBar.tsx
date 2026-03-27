import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Info, Bell, Globe, Shield, Database } from 'lucide-react';

interface AvatarDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  moduleColor: string;
}

const AvatarDropdown: React.FC<AvatarDropdownProps> = ({ isOpen, onClose, moduleColor }) => {
  const recentSearches = [
    { query: "Salt spray test requirements Volvo", module: "DocSeek.Ai", time: "2 min ago" },
    { query: "M16 stainless bolt high load", module: "PartSeek.Ai", time: "15 min ago" },
    { query: "VDA 233-102 corrosion standard", module: "DocSeek.Ai", time: "1 hour ago" },
    { query: "DIN 912 socket head cap screw", module: "PartSeek.Ai", time: "3 hours ago" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="absolute right-0 top-full mt-2 w-80 glass-card z-50 p-3"
          >
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
              Recent searches
            </p>
            <div className="space-y-1">
              {recentSearches.map((s, i) => (
                <button
                  key={i}
                  className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-muted/40 transition-colors duration-200 group"
                >
                  <p className="text-sm text-foreground truncate">{s.query}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-medium" style={{ color: s.module.includes("Doc") ? "#10B981" : "#0EA5E9" }}>
                      {s.module}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{s.time}</span>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-border px-2">
              <div className="flex items-center gap-2 opacity-40 cursor-not-allowed">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <span className="text-xs text-muted-foreground">Team searches — coming in Phase 2</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const settingsItems = [
  { icon: Globe, label: "Language", value: "English / Deutsch", description: "Interface language" },
  { icon: Database, label: "Data Sources", value: "3 connected", description: "Manage document sources" },
  { icon: Shield, label: "Privacy", value: "On-Premise", description: "All data stays local" },
  { icon: Bell, label: "Notifications", value: "Enabled", description: "Search alerts & updates" },
  { icon: Info, label: "About", value: "v1.0.0", description: "KnowSeek.Ai platform info" },
];

const SettingsPanel: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, x: 60, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="fixed right-4 z-50 glass-card w-[340px] p-5"
            style={{ top: 66 }}
          >
            <div className="flex items-center gap-2 mb-5">
              <Settings size={16} className="text-muted-foreground" />
              <h2 className="text-sm font-bold text-foreground tracking-wide">Settings</h2>
            </div>

            <div className="space-y-1">
              {settingsItems.map((item, i) => (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, type: "spring", stiffness: 400, damping: 30 }}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-muted/30 transition-colors duration-200 text-left group"
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <item.icon size={15} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground">{item.label}</p>
                    <p className="text-[10px] text-muted-foreground">{item.description}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-medium">{item.value}</span>
                </motion.button>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-border">
              <p className="text-[10px] text-muted-foreground text-center">
                KnowSeek.Ai · On-Premise · No cloud. No internet required.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

interface TopBarProps {
  moduleColor: string;
  isProcessing?: boolean;
}

const TopBar: React.FC<TopBarProps> = ({ moduleColor, isProcessing = false }) => {
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const toggleSettings = () => {
    setSettingsOpen(!settingsOpen);
    if (avatarOpen) setAvatarOpen(false);
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4"
      style={{
        height: 56,
        background: '#0D1526',
        borderBottom: '1px solid #1E293B',
      }}
    >
      {/* Left spacer */}
      <div className="w-[120px]" />

      {/* Center masthead */}
      <div className="flex items-center gap-3 select-none">
        <span
          style={{
            fontSize: 10,
            letterSpacing: 3,
            textTransform: 'uppercase' as const,
            color: '#6A7D93',
            fontWeight: 500,
          }}
        >
          NOTHING IS IMPOSSIBLE.
        </span>
        <span style={{ color: '#1E293B', fontSize: 14 }}>·</span>
        <div className="relative flex items-center justify-center">
          <div className="metallic-aura" />
          <span className="metallic-text">KnowSeek.Ai</span>
        </div>
        <span style={{ color: '#1E293B', fontSize: 14 }}>·</span>
        <span
          style={{
            fontSize: 10,
            letterSpacing: 3,
            textTransform: 'uppercase' as const,
            color: '#6A7D93',
            fontWeight: 500,
          }}
        >
          USE YOUR KNOWLEDGE.
        </span>
      </div>

      {/* Right buttons */}
      <div className="flex items-center gap-[10px] relative">
        {/* Hamburger / X toggle */}
        <button
          onClick={toggleSettings}
          className="hover-lift flex items-center justify-center"
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: settingsOpen
              ? 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.04) 100%)'
              : 'linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}
          title={settingsOpen ? "Close Settings" : "Settings"}
        >
          <svg width="20" height="17" viewBox="0 0 20 17">
            {/* Line 1: top → rotates to \ */}
            <motion.line
              x1={settingsOpen ? 2 : 0}
              y1={settingsOpen ? 1 : 1}
              x2={settingsOpen ? 18 : 20}
              y2={settingsOpen ? 16 : 1}
              stroke="rgba(148,163,184,0.95)"
              strokeWidth="1.5"
              strokeLinecap="round"
              animate={{
                x1: settingsOpen ? 2 : 0,
                y1: settingsOpen ? 1 : 1,
                x2: settingsOpen ? 18 : 20,
                y2: settingsOpen ? 16 : 1,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            />
            {/* Line 2: middle → fades out */}
            <motion.line
              x1="0"
              y1="8.5"
              x2="20"
              y2="8.5"
              stroke="rgba(148,163,184,0.95)"
              strokeWidth="1.5"
              strokeLinecap="round"
              animate={{
                opacity: settingsOpen ? 0 : 1,
              }}
              transition={{ duration: 0.15 }}
            />
            {/* Line 3: bottom → rotates to / */}
            <motion.line
              x1={settingsOpen ? 2 : 0}
              y1={settingsOpen ? 16 : 16}
              x2={settingsOpen ? 18 : 20}
              y2={settingsOpen ? 1 : 16}
              stroke="rgba(148,163,184,0.95)"
              strokeWidth="1.5"
              strokeLinecap="round"
              animate={{
                x1: settingsOpen ? 2 : 0,
                y1: settingsOpen ? 16 : 16,
                x2: settingsOpen ? 18 : 20,
                y2: settingsOpen ? 1 : 16,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            />
          </svg>
        </button>

        {/* Avatar */}
        <button
          className={`hover-lift flex items-center justify-center ${isProcessing ? 'avatar-pulse' : ''}`}
          onClick={() => { setAvatarOpen(!avatarOpen); if (settingsOpen) setSettingsOpen(false); }}
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: `linear-gradient(145deg, ${moduleColor}24 0%, ${moduleColor}0A 100%)`,
            border: `1px solid ${moduleColor}73`,
            boxShadow: `0 2px 8px rgba(0,0,0,0.5), inset 0 1px 0 ${moduleColor}2E, 0 0 12px ${moduleColor}1A`,
          }}
          title="Profile & Search History"
        >
          <svg width="22" height="22" viewBox="0 0 30 30" fill="none">
            <circle cx="15" cy="7" r="4" stroke={moduleColor} strokeWidth="1.5" fill="none" />
            <path d="M3 18 A16 8.5 0 0 1 27 18" stroke={moduleColor} strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <text x="15" y="27" textAnchor="middle" fill={moduleColor} fontSize="7.5" fontWeight="900" letterSpacing="1.2" fontFamily="Inter">
              SIA
            </text>
          </svg>
        </button>

        <AvatarDropdown isOpen={avatarOpen} onClose={() => setAvatarOpen(false)} moduleColor={moduleColor} />
        <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      </div>
    </header>
  );
};

export default TopBar;
