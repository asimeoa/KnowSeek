import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ModuleId, ModuleIcon, modules } from './AppSidebar';
import { Search } from 'lucide-react';

interface SearchBlockProps {
  moduleId: ModuleId;
  onSearch: (query: string) => void;
  hasResults: boolean;
}

const SearchBlock: React.FC<SearchBlockProps> = ({ moduleId, onSearch, hasResults }) => {
  const [query, setQuery] = useState('');
  const mod = modules.find(m => m.id === moduleId)!;
  const isUnderConstruction = !mod.active;
  const isPulsing = !isUnderConstruction && query.length === 0 && !hasResults;

  const placeholders: Record<string, string> = {
    docseek: "Ask anything... e.g. What are the salt spray test requirements for Volvo?",
    partseek: "Describe the part... e.g. M16 stainless steel bolt, high axial load",
    normseek: "Under construction",
    costseek: "Under construction",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isUnderConstruction) {
      onSearch(query.trim());
    }
  };

  const pulseClass = moduleId === 'docseek' ? 'pulse-emerald' : moduleId === 'partseek' ? 'pulse-blue' : '';

  return (
    <div className="w-full max-w-2xl mx-auto" style={{ opacity: isUnderConstruction ? 0.55 : 1 }}>
      {/* Box 1 — Module Name Badge (STATIC) */}
      <div
        className="flex items-center gap-3 px-[18px] py-[11px]"
        style={{
          borderRadius: 12,
          border: `0.5px solid ${mod.color}E6`,
          background: `${mod.color}0D`,
          boxShadow: `inset 0 0 20px ${mod.color}14, inset 0 0 6px ${mod.color}0D`,
        }}
      >
        <ModuleIcon moduleId={moduleId} color={mod.color} size={22} />
        <span className="text-[15px] font-bold" style={{ color: mod.color }}>{mod.name}</span>
      </div>

      {/* 4px gap */}
      <div style={{ height: 4 }} />

      {/* Box 2 — Search Input (PULSES when empty) */}
      <form
        onSubmit={handleSubmit}
        className={`flex items-center gap-3 px-4 py-[18px] ${isPulsing ? pulseClass : ''}`}
        style={{
          borderRadius: 12,
          border: `1px solid ${mod.color}${isPulsing ? '59' : '99'}`,
          background: `${mod.color}0A`,
          transition: 'border-color 0.3s, box-shadow 0.3s',
        }}
      >
        {isUnderConstruction ? (
          <span className="flex-1 text-center text-sm font-medium" style={{ color: mod.color }}>
            Under construction
          </span>
        ) : (
          <>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholders[moduleId]}
              className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground/60"
            />
            <button
              type="submit"
              className="flex items-center justify-center rounded-full hover-lift"
              style={{
                width: 28,
                height: 28,
                background: `${mod.color}33`,
                color: mod.color,
              }}
              title="Search"
            >
              <Search size={12} />
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default SearchBlock;
