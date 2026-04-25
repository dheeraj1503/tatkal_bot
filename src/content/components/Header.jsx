import React from 'react';
import { Settings, HelpCircle, ChevronLeft, Moon, Sun } from 'lucide-react';

export default function Header({ darkMode, onToggleDark, onCollapse }) {
  return (
    <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
      {/* Logo + Title */}
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-blue to-blue-700 flex items-center justify-center shadow-md shadow-blue-500/20 flex-shrink-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
            <path d="M4 16h16v2H4zM4 6h16v2H4z"/>
          </svg>
        </div>
        <span className="font-bold text-[15px] text-gray-900 dark:text-white tracking-tight">RailAssist</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <button
          onClick={onToggleDark}
          title={darkMode ? 'Light mode' : 'Dark mode'}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 transition-all"
        >
          {darkMode
            ? <Sun size={16} strokeWidth={2} />
            : <Moon size={16} strokeWidth={2} />}
        </button>
        <button
          title="Help"
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 transition-all"
        >
          <HelpCircle size={16} strokeWidth={2} />
        </button>
        <button
          title="Settings"
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 transition-all"
        >
          <Settings size={16} strokeWidth={2} />
        </button>
        <button
          onClick={onCollapse}
          title="Collapse sidebar"
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 transition-all ml-1"
        >
          <ChevronLeft size={16} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
