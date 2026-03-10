import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TopBar from '../components/TopBar';
import AppSidebar, { ModuleId, modules } from '../components/AppSidebar';
import SearchBlock from '../components/SearchBlock';
import DocSeekView from '../components/DocSeekView';
import PartSeekView from '../components/PartSeekView';

const moduleColors: Record<ModuleId, string> = {
  docseek: '#10B981',
  partseek: '#0EA5E9',
  normseek: '#A5B4FC',
  costseek: '#FCA773',
};

const Index = () => {
  const [activeModule, setActiveModule] = useState<ModuleId>('docseek');
  const [searchQuery, setSearchQuery] = useState('');
  const [hasResults, setHasResults] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsProcessing(true);
    // Simulate AI processing
    setTimeout(() => {
      setHasResults(true);
      setIsProcessing(false);
    }, 1200);
  };

  const handleModuleChange = (id: ModuleId) => {
    setActiveModule(id);
    setSearchQuery('');
    setHasResults(false);
    setIsProcessing(false);
  };

  const mod = modules.find(m => m.id === activeModule)!;

  return (
    <div className="min-h-screen" style={{ background: '#0F172A' }}>
      <TopBar moduleColor={moduleColors[activeModule]} isProcessing={isProcessing} />
      <AppSidebar activeModule={activeModule} onModuleChange={handleModuleChange} />

      {/* Main content */}
      <main className="pt-[56px] pl-[48px] min-h-screen" style={{ overflow: 'visible' }}>
        <div className="p-6 sm:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex flex-col items-center"
            >
              <div className="w-full max-w-2xl mt-8" style={{ padding: '0 12px', overflow: 'visible' }}>
                <SearchBlock
                  moduleId={activeModule}
                  onSearch={handleSearch}
                  hasResults={hasResults}
                />

                {/* Under construction messages */}
                {activeModule === 'normseek' && (
                   <p className="text-center text-sm mt-6" style={{ color: '#C7D2FE', opacity: 0.7 }}>
                     NormSeek.Ai — Compare requirements against ISO and OEM standards. Available in Phase 2.
                   </p>
                 )}
                 {activeModule === 'costseek' && (
                   <p className="text-center text-sm mt-6" style={{ color: '#FDB896', opacity: 0.7 }}>
                     CostSeek.Ai — Design-to-cost analysis in the development phase. Available in Phase 2.
                   </p>
                 )}

                {/* Module views */}
                {activeModule === 'docseek' && (
                  <DocSeekView query={searchQuery} onSearch={handleSearch} />
                )}
                {activeModule === 'partseek' && (
                  <PartSeekView query={searchQuery} />
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Index;
