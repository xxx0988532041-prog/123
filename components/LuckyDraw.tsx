
import React, { useState, useEffect, useRef } from 'react';
import { Participant } from '../types';
import { generateWinnerMessage } from '../services/geminiService';

interface LuckyDrawProps {
  participants: Participant[];
}

const LuckyDraw: React.FC<LuckyDrawProps> = ({ participants }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [winner, setWinner] = useState<Participant | null>(null);
  const [allowRepeat, setAllowRepeat] = useState(false);
  const [pool, setPool] = useState<Participant[]>([]);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [aiMessage, setAiMessage] = useState('');
  const [winnersHistory, setWinnersHistory] = useState<Participant[]>([]);
  
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setPool([...participants]);
  }, [participants]);

  const startDraw = async () => {
    if (pool.length === 0) {
      alert("所有參與者都已經抽過了！請重置抽籤池或增加參與者。");
      return;
    }

    setIsDrawing(true);
    setWinner(null);
    setAiMessage('');

    let speed = 50;
    let cycles = 0;
    const maxCycles = 40;

    const animate = () => {
      setDisplayIndex(prev => (prev + 1) % pool.length);
      cycles++;

      if (cycles < maxCycles) {
        timerRef.current = window.setTimeout(animate, speed);
        if (cycles > 30) speed += 30;
      } else {
        const winningIndex = Math.floor(Math.random() * pool.length);
        const luckyWinner = pool[winningIndex];
        
        setWinner(luckyWinner);
        setIsDrawing(false);
        setWinnersHistory(prev => [luckyWinner, ...prev]);

        if (!allowRepeat) {
          setPool(prev => prev.filter(p => p.id !== luckyWinner.id));
        }

        generateWinnerMessage(luckyWinner.name).then(setAiMessage);
      }
    };

    animate();
  };

  const resetPool = () => {
    if (confirm('確定要重置所有抽籤歷史與抽籤池嗎？')) {
      setPool([...participants]);
      setWinner(null);
      setWinnersHistory([]);
      setAiMessage('');
    }
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
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center relative overflow-hidden">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
             <label className="flex items-center cursor-pointer group">
              <input 
                type="checkbox" 
                checked={allowRepeat} 
                onChange={() => setAllowRepeat(!allowRepeat)}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm font-medium text-gray-600 group-hover:text-gray-800">允許重複中獎</span>
            </label>
            <div className="h-4 w-px bg-gray-200" />
            <span className="text-sm text-gray-500">剩餘抽籤池：{pool.length} 人</span>
          </div>
          <button 
            onClick={resetPool}
            className="text-xs text-indigo-600 font-semibold hover:underline"
          >
            重置抽籤紀錄
          </button>
        </div>

        <div className="h-48 flex items-center justify-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 mb-8">
          {isDrawing ? (
            <div className="text-5xl font-bold text-indigo-600 animate-pulse transition-all">
              {pool[displayIndex]?.name}
            </div>
          ) : winner ? (
            <div className="text-center animate-bounce">
              <div className="text-indigo-600 text-sm font-bold uppercase tracking-widest mb-2">中獎者揭曉！</div>
              <div className="text-6xl font-black text-gray-900 drop-shadow-sm">{winner.name}</div>
            </div>
          ) : (
            <div className="text-gray-300 text-xl italic font-medium">準備好抽獎了嗎？</div>
          )}
        </div>

        <button
          onClick={startDraw}
          disabled={isDrawing || pool.length === 0}
          className={`w-64 py-4 rounded-full font-bold text-xl shadow-xl transition-all transform hover:scale-105 active:scale-95 ${
            isDrawing || pool.length === 0 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-indigo-200'
          }`}
        >
          {isDrawing ? '正在轉動...' : '立即抽獎'}
        </button>

        {aiMessage && (
          <div className="mt-8 p-4 bg-indigo-50 rounded-lg text-indigo-700 italic animate-fade-in max-w-lg mx-auto">
            " {aiMessage} "
          </div>
        )}
      </div>

      {winnersHistory.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            中獎歷史紀錄
          </h3>
          <div className="flex flex-wrap gap-2">
            {winnersHistory.map((w, idx) => (
              <span key={`${w.id}-${idx}`} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600 border border-gray-200">
                {w.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LuckyDraw;
