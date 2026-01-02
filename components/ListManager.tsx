
import React, { useState, useMemo } from 'react';
import { Participant } from '../types';

interface ListManagerProps {
  participants: Participant[];
  setParticipants: (p: Participant[]) => void;
}

const ListManager: React.FC<ListManagerProps> = ({ participants, setParticipants }) => {
  const [inputText, setInputText] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      parseContent(text);
    };
    reader.readAsText(file);
  };

  const parseContent = (content: string) => {
    const names = content
      .split(/[\n,，]+/)
      .map(n => n.trim())
      .filter(n => n.length > 0);
    
    const newList = names.map(name => ({
      id: Math.random().toString(36).substr(2, 9),
      name
    }));
    
    setParticipants([...participants, ...newList]);
  };

  const handlePasteSubmit = () => {
    parseContent(inputText);
    setInputText('');
  };

  const clearList = () => {
    if (confirm('確定要清空所有名單嗎？')) {
      setParticipants([]);
    }
  };

  const loadMockData = () => {
    const mockNames = ['張小明', '李大華', '王曉芬', '陳美玲', '林志豪', '林志豪', '吳淑芬', '郭台銘', '蔡英文', '馬英九'];
    const mockList = mockNames.map(name => ({
      id: Math.random().toString(36).substr(2, 9),
      name
    }));
    setParticipants(mockList);
  };

  // 偵測重複名單
  const duplicateNames = useMemo(() => {
    const counts = participants.reduce((acc, p) => {
      acc[p.name] = (acc[p.name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.keys(counts).filter(name => counts[name] > 1);
  }, [participants]);

  const removeDuplicates = () => {
    const seen = new Set();
    const uniqueList = participants.filter(p => {
      if (seen.has(p.name)) return false;
      seen.add(p.name);
      return true;
    });
    setParticipants(uniqueList);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            上傳檔案
          </h3>
          <p className="text-sm text-gray-500 mb-4">上傳 CSV 或 TXT 檔，姓名請以換行或逗號分隔。</p>
          <div className="flex flex-col gap-3">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <p className="mb-2 text-sm text-gray-500 font-semibold">點擊上傳檔案</p>
                <p className="text-xs text-gray-400">CSV, TXT (最多 500 人)</p>
              </div>
              <input type="file" className="hidden" accept=".csv,.txt" onChange={handleFileUpload} />
            </label>
            <button 
              onClick={loadMockData}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium py-2 border border-indigo-200 rounded bg-indigo-50 transition-colors"
            >
              試試看「生成模擬名單」
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            手動貼上
          </h3>
          <p className="text-sm text-gray-500 mb-4">請在此貼上姓名列表，每行一個姓名。</p>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full h-24 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm mb-3"
            placeholder="張小明&#10;李大華&#10;..."
          />
          <button
            onClick={handlePasteSubmit}
            disabled={!inputText.trim()}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            加入名單
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-gray-800">
              參與者名單 ({participants.length})
            </h3>
            {duplicateNames.length > 0 && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  偵測到重複姓名！
                </span>
                <button 
                  onClick={removeDuplicates}
                  className="text-xs text-indigo-600 hover:underline font-bold"
                >
                  一鍵移除重複
                </button>
              </div>
            )}
          </div>
          {participants.length > 0 && (
            <button
              onClick={clearList}
              className="text-red-500 text-sm font-medium hover:text-red-700 transition-colors"
            >
              清空名單
            </button>
          )}
        </div>
        
        {participants.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p>目前尚無名單，請由上方匯入或貼上。</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
            {participants.map((p) => {
              const isDuplicate = duplicateNames.includes(p.name);
              return (
                <div 
                  key={p.id} 
                  className={`p-3 rounded-lg border text-sm font-medium text-center truncate transition-all ${
                    isDuplicate 
                      ? 'bg-amber-50 border-amber-300 text-amber-800 ring-2 ring-amber-100' 
                      : 'bg-gray-50 border-gray-100 text-gray-700'
                  }`}
                  title={isDuplicate ? '此姓名重複' : p.name}
                >
                  {p.name}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListManager;
