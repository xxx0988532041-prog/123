
import React, { useState } from 'react';
import { Participant, AppTab } from './types';
import TabButton from './components/TabButton';
import ListManager from './components/ListManager';
import LuckyDraw from './components/LuckyDraw';
import TeamGenerator from './components/TeamGenerator';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.LIST_MANAGEMENT);
  const [participants, setParticipants] = useState<Participant[]>([]);

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.LIST_MANAGEMENT:
        return <ListManager participants={participants} setParticipants={setParticipants} />;
      case AppTab.LUCKY_DRAW:
        return <LuckyDraw participants={participants} />;
      case AppTab.TEAM_GROUPING:
        return <TeamGenerator participants={participants} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                HR 智慧小助手
              </h1>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto no-scrollbar">
          <nav className="flex space-x-0">
            <TabButton 
              tab={AppTab.LIST_MANAGEMENT} 
              active={activeTab === AppTab.LIST_MANAGEMENT} 
              onClick={setActiveTab} 
              label="名單管理"
              icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
            />
            <TabButton 
              tab={AppTab.LUCKY_DRAW} 
              active={activeTab === AppTab.LUCKY_DRAW} 
              onClick={setActiveTab} 
              label="獎品抽籤"
              icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.91 8.84 8.56 2.23a1.93 1.93 0 0 0-2.6 1.81l-.01 13.07a1.93 1.93 0 0 0 2.6 1.81l12.35-6.61a1.93 1.93 0 0 0 0-3.47Z"/><line x1="12" y1="6" x2="12" y2="18"/></svg>}
            />
            <TabButton 
              tab={AppTab.TEAM_GROUPING} 
              active={activeTab === AppTab.TEAM_GROUPING} 
              onClick={setActiveTab} 
              label="自動分組"
              icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
            />
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {/* Footer info */}
      <footer className="py-8 text-center text-gray-400 text-sm">
        <p>&copy; 2024 HR 智慧小助手 • 採用 Gemini AI 技術支援</p>
      </footer>
    </div>
  );
};

export default App;
