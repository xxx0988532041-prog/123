
import React, { useState } from 'react';
import { Participant, Group } from '../types';
import { generateTeamNames } from '../services/geminiService';

interface TeamGeneratorProps {
  participants: Participant[];
}

const TeamGenerator: React.FC<TeamGeneratorProps> = ({ participants }) => {
  const [groupSize, setGroupSize] = useState(4);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateGroups = async () => {
    if (participants.length < 2) {
      alert("至少需要 2 位參與者才能進行分組。");
      return;
    }

    setIsGenerating(true);
    
    const shuffled = [...participants].sort(() => Math.random() - 0.5);
    const numberOfGroups = Math.ceil(shuffled.length / groupSize);
    
    const teamNames = await generateTeamNames(numberOfGroups);
    
    const newGroups: Group[] = [];
    for (let i = 0; i < numberOfGroups; i++) {
      newGroups.push({
        id: Math.random().toString(36).substr(2, 9),
        name: teamNames[i] || `第 ${i + 1} 組`,
        members: shuffled.slice(i * groupSize, (i + 1) * groupSize)
      });
    }

    setGroups(newGroups);
    setIsGenerating(false);
  };

  const downloadCSV = () => {
    if (groups.length === 0) return;

    let csvContent = "\ufeff組別名稱,成員姓名\n"; // UTF-8 BOM
    groups.forEach(group => {
      group.members.forEach(member => {
        csvContent += `"${group.name}","${member.name}"\n`;
      });
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `分組結果_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (participants.length === 0) {
    return (
      <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
        <p className="text-gray-500">請先在「名單管理」分頁中加入參與者。</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row items-end gap-6">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">每組人數上限</label>
            <input
              type="number"
              min="2"
              max={participants.length}
              value={groupSize}
              onChange={(e) => setGroupSize(parseInt(e.target.value) || 2)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={generateGroups}
              disabled={isGenerating}
              className="flex-1 md:w-auto px-10 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-100"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  AI 分組中...
                </>
              ) : '開始分組'}
            </button>
            {groups.length > 0 && (
              <button
                onClick={downloadCSV}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-100"
                title="下載分組結果 CSV"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                下載 CSV
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group, gIdx) => (
          <div key={group.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-4 border-b border-gray-100">
              <h4 className="font-bold text-indigo-700 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                  {gIdx + 1}
                </span>
                {group.name}
              </h4>
              <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">{group.members.length} 位成員</span>
            </div>
            <div className="p-4 space-y-2">
              {group.members.map((m, mIdx) => (
                <div key={m.id} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 transition-all group">
                  <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center text-xs font-bold group-hover:bg-indigo-100 group-hover:text-indigo-500">
                    {m.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{m.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamGenerator;
