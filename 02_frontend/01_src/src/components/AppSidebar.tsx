import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

export type ModuleId = 'docseek' | 'partseek' | 'normseek' | 'costseek';

interface Module {
  id: ModuleId;
  name: string;
  color: string;
  iconColor: string;
  tooltipColor: string;
  description: string;
  active: boolean;
}

export const modules: Module[] = [
  { id: 'docseek', name: 'DocSeek.Ai', color: '#10B981', iconColor: '#10B981', tooltipColor: '#34D399', description: 'Search all company documents', active: true },
  { id: 'partseek', name: 'PartSeek.Ai', color: '#0EA5E9', iconColor: '#0EA5E9', tooltipColor: '#38BDF8', description: 'Find internal standard parts', active: true },
  { id: 'normseek', name: 'NormSeek.Ai', color: '#9199F4', iconColor: '#9199F4', tooltipColor: '#9199F4', description: 'Compare against ISO & OEM standards', active: false },
  { id: 'costseek', name: 'CostSeek.Ai', color: '#FC9D57', iconColor: '#FC9D57', tooltipColor: '#FC9D57', description: 'Design-to-cost analysis', active: false },
];

const DocSeekIcon = ({ color, size = 22 }: { color: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="13" y2="17" />
    <circle cx="18" cy="18" r="3" fill="#0D1526" stroke={color} strokeWidth="1.2" />
    <line x1="20.1" y1="20.1" x2="22" y2="22" stroke={color} strokeWidth="1.2" />
  </svg>
);

const PartSeekIcon = ({ color, size = 22 }: { color: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="10" cy="10" r="5" />
    <circle cx="10" cy="10" r="2.5" />
    <line x1="10" y1="3" x2="10" y2="5" strokeWidth="2" />
    <line x1="10" y1="15" x2="10" y2="17" strokeWidth="2" />
    <line x1="3" y1="10" x2="5" y2="10" strokeWidth="2" />
    <line x1="15" y1="10" x2="17" y2="10" strokeWidth="2" />
    <line x1="5.05" y1="5.05" x2="6.46" y2="6.46" strokeWidth="2" />
    <line x1="13.54" y1="13.54" x2="14.95" y2="14.95" strokeWidth="2" />
    <line x1="5.05" y1="14.95" x2="6.46" y2="13.54" strokeWidth="2" />
    <line x1="13.54" y1="6.46" x2="14.95" y2="5.05" strokeWidth="2" />
    <circle cx="10" cy="10" r="1.5" fill="none" stroke={color} strokeWidth="1" />
    <line x1="11.1" y1="11.1" x2="12.5" y2="12.5" stroke={color} strokeWidth="1" />
    <circle cx="19" cy="18" r="3" />
    <line x1="19" y1="14" x2="19" y2="15" strokeWidth="1.5" />
    <line x1="19" y1="21" x2="19" y2="22" strokeWidth="1.5" />
    <line x1="15" y1="18" x2="16" y2="18" strokeWidth="1.5" />
    <line x1="22" y1="18" x2="23" y2="18" strokeWidth="1.5" />
  </svg>
);

const NormSeekIcon = ({ color, size = 22 }: { color: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="2" width="14" height="20" rx="2" />
    <path d="M7 8l2 2 4-4" />
    <path d="M7 14l2 2 4-4" />
    <circle cx="18" cy="18" r="3" fill="#0D1526" stroke={color} strokeWidth="1.2" />
    <line x1="20.1" y1="20.1" x2="22" y2="22" stroke={color} strokeWidth="1.2" />
  </svg>
);

const CostSeekIcon = ({ color, size = 22 }: { color: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <text x="5" y="14" fill={color} stroke="none" fontSize="14" fontWeight="700" fontFamily="Inter">€</text>
    <polyline points="14 6 14 14 22 14" />
    <polyline points="14 6 18 10 22 8" />
    <circle cx="18" cy="19" r="2.5" fill="#0D1526" stroke={color} strokeWidth="1.2" />
    <line x1="19.8" y1="20.8" x2="22" y2="22" stroke={color} strokeWidth="1.2" />
  </svg>
);

export const ModuleIcon: React.FC<{ moduleId: ModuleId; color: string; size?: number }> = ({ moduleId, color, size }) => {
  switch (moduleId) {
    case 'docseek': return <DocSeekIcon color={color} size={size} />;
    case 'partseek': return <PartSeekIcon color={color} size={size} />;
    case 'normseek': return <NormSeekIcon color={color} size={size} />;
    case 'costseek': return <CostSeekIcon color={color} size={size} />;
  }
};

interface SidebarProps {
  activeModule: ModuleId;
  onModuleChange: (id: ModuleId) => void;
}

const AppSidebar: React.FC<SidebarProps> = ({ activeModule, onModuleChange }) => {
  const [hovered, setHovered] = useState(false);
  const [tooltipId, setTooltipId] = useState<ModuleId | null>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = useCallback(() => {
    if (leaveTimer.current) { clearTimeout(leaveTimer.current); leaveTimer.current = null; }
    setHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    leaveTimer.current = setTimeout(() => setHovered(false), 400);
  }, []);

  const handleItemEnter = useCallback((id: ModuleId) => {
    if (tooltipTimer.current) clearTimeout(tooltipTimer.current);
    tooltipTimer.current = setTimeout(() => setTooltipId(id), 500);
  }, []);

  const handleItemLeave = useCallback(() => {
    if (tooltipTimer.current) clearTimeout(tooltipTimer.current);
    setTooltipId(null);
  }, []);

  return (
    <motion.aside
      className="fixed left-0 z-40 flex flex-col items-center py-4 gap-2"
      style={{
        top: 56,
        bottom: 0,
        background: '#0D1526',
        borderRight: '1px solid #1E293B',
      }}
      animate={{ width: hovered ? 220 : 48 }}
      transition={{ type: "spring", stiffness: 300, damping: 25, mass: 0.8 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex flex-col gap-1 mt-4 w-full px-1">
        {modules.map((mod) => {
          const isActive = activeModule === mod.id;
          const opacity = mod.active ? 1 : 0.4;

          return (
            <button
              key={mod.id}
              onClick={() => onModuleChange(mod.id)}
              onMouseEnter={() => handleItemEnter(mod.id)}
              onMouseLeave={handleItemLeave}
              className="flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors duration-200 hover-lift relative"
              style={{
                background: isActive ? `${mod.color}14` : 'transparent',
              }}
            >
              <div className={`${isActive ? 'breathing-glow' : ''} ${mod.id === 'normseek' ? 'pulse-indigo' : ''} ${mod.id === 'costseek' ? 'pulse-orange' : ''}`} style={{ color: mod.iconColor, display: 'flex', borderRadius: '6px' }}>
                <ModuleIcon moduleId={mod.id} color={mod.iconColor} size={22} />
              </div>
              {hovered && (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: mod.active ? 1 : 0.5, x: 0 }}
                  transition={{ duration: 0.15 }}
                  className="text-sm font-semibold whitespace-nowrap"
                  style={{ color: mod.iconColor }}
                >
                  {mod.name}
                </motion.span>
              )}
              {isActive && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full"
                  style={{ background: mod.color }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {!hovered && tooltipId === mod.id && (
                <div
                  className="sidebar-tooltip visible"
                  style={{ background: mod.tooltipColor }}
                >
                  <span style={{ fontWeight: 700 }}>{mod.name}</span>
                  <br />
                  <span style={{ fontWeight: 400, fontSize: 10 }}>{mod.description}</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </motion.aside>
  );
};

export default AppSidebar;
