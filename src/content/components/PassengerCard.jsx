import React from 'react';
import { Trash2 } from 'lucide-react';
import { fillPassenger } from '../utils/autofill';

const BERTH_OPTIONS  = ['No Pref', 'Lower', 'Middle', 'Upper', 'Side Lower', 'Side Upper'];
const GENDER_OPTIONS = ['Male', 'Female', 'Transgender'];

export default function PassengerCard({ passenger, index, onUpdate, onDelete }) {
  const update = (field, val) => onUpdate({ ...passenger, [field]: val });

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-50 dark:border-gray-700/30">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-brand-blue dark:text-blue-400 flex items-center justify-center text-[11px] font-bold">
            {index + 1}
          </div>
          <span className="text-[13px] font-bold text-gray-800 dark:text-white">
            Passenger {index + 1}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => fillPassenger(passenger, index)}
            className="px-3 py-1 bg-blue-50 dark:bg-blue-950/40 text-brand-blue dark:text-blue-400 text-[11px] font-bold rounded-lg border border-blue-100/50 dark:border-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
          >
            Fill
          </button>
          <button onClick={onDelete} className="p-1 text-gray-400 hover:text-red-500 transition-colors">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-4">
        {/* Name */}
        <div>
          <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">NAME</label>
          <input
            value={passenger.name}
            onChange={e => update('name', e.target.value)}
            placeholder="Full Name"
            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl px-3.5 py-2.5 text-[13px] font-semibold text-gray-800 dark:text-white outline-none focus:border-brand-blue/50 focus:ring-2 focus:ring-brand-blue/10 transition-all placeholder-gray-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Age */}
          <div>
            <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">AGE</label>
            <input
              type="number"
              value={passenger.age}
              onChange={e => update('age', e.target.value)}
              placeholder="Age"
              min="1" max="120"
              className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl px-3.5 py-2.5 text-[13px] font-semibold text-gray-800 dark:text-white outline-none focus:border-brand-blue/50 focus:ring-2 focus:ring-brand-blue/10 transition-all placeholder-gray-400"
            />
          </div>
          {/* Gender */}
          <div>
            <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">GENDER</label>
            <select
              value={passenger.gender}
              onChange={e => update('gender', e.target.value)}
              className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl px-3.5 py-2.5 text-[13px] font-semibold text-gray-800 dark:text-white outline-none focus:border-brand-blue/50 focus:ring-2 focus:ring-brand-blue/10 transition-all"
            >
              {GENDER_OPTIONS.map(g => <option key={g}>{g}</option>)}
            </select>
          </div>
        </div>

        {/* Berth */}
        <div>
          <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">BERTH PREFERENCE</label>
          <select
            value={passenger.berth}
            onChange={e => update('berth', e.target.value)}
            className="w-full bg-white dark:bg-gray-800 border border-brand-blue/50 rounded-xl px-3.5 py-2.5 text-[13px] font-semibold text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all"
          >
            {BERTH_OPTIONS.map(b => <option key={b}>{b}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}
