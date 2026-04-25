import React from 'react';
import { X, Plus } from 'lucide-react';

export default function TicketTabs({ tickets, activeIdx, onSelect, onAdd, onDelete }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-0.5" style={{ scrollbarWidth: 'none' }}>
      {tickets.map((t, i) => {
        const isActive = i === activeIdx;
        return (
          <button
            key={t.id}
            onClick={() => onSelect(i)}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-bold transition-all ${
              isActive
                ? 'bg-brand-blue text-white shadow-md shadow-blue-500/20'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Ticket {i + 1}
            {tickets.length > 1 && (
              <span
                role="button"
                onClick={(e) => { e.stopPropagation(); onDelete(i); }}
                className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                  isActive
                    ? 'hover:bg-white/20 text-white'
                    : 'hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-400 dark:text-gray-500'
                }`}
              >
                <X size={10} strokeWidth={3} />
              </span>
            )}
          </button>
        );
      })}

      {/* Add ticket */}
      <button
        onClick={onAdd}
        title="Add ticket"
        className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full border-2 border-dashed border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 hover:border-brand-blue hover:text-brand-blue dark:hover:border-blue-500 dark:hover:text-blue-400 transition-all"
      >
        <Plus size={16} strokeWidth={2.5} />
      </button>
    </div>
  );
}
