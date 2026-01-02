
import React from 'react';
import { AppTab } from '../types';

interface TabButtonProps {
  tab: AppTab;
  active: boolean;
  onClick: (tab: AppTab) => void;
  label: string;
  icon: React.ReactNode;
}

const TabButton: React.FC<TabButtonProps> = ({ tab, active, onClick, label, icon }) => {
  return (
    <button
      onClick={() => onClick(tab)}
      className={`flex items-center gap-2 px-6 py-3 font-medium transition-all duration-200 border-b-2 ${
        active 
          ? 'text-indigo-600 border-indigo-600 bg-indigo-50/50' 
          : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50'
      }`}
    >
      {icon}
      {label}
    </button>
  );
};

export default TabButton;
