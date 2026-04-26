import React from 'react';
import { Search } from 'lucide-react';



export default function TrainSection({ journey, onChange }) {
  const update = (field, val) => onChange({ ...journey, [field]: val });

  return (
    <section className="flex flex-col gap-3">
      {/* Header */}
      <h3 className="text-[13px] font-bold text-gray-800 dark:text-white px-0.5">Train Details</h3>

      {/* Number input + Search button */}
      <div className="flex gap-2 items-start">
        <div className="flex-1 flex flex-col gap-1">
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-3 flex flex-col justify-center focus-within:ring-2 focus-within:ring-brand-blue/40 transition-all">
            <label className="block text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Train Number</label>
            <input
              type="text"
              value={journey.trainNumber}
              onChange={e => update('trainNumber', e.target.value.replace(/\D/g, '').slice(0, 5))}
              placeholder="Enter train number (e.g., 12951)"
              maxLength={5}
              className="w-full bg-transparent border-none outline-none font-semibold text-[13px] text-gray-800 dark:text-white p-0 placeholder-gray-300 dark:placeholder-gray-600"
            />
          </div>
        </div>

        <button
          className="px-6 h-[50px] bg-brand-blue hover:bg-blue-700 active:scale-95 text-white font-bold text-[13px] rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
        >
          <Search size={14} strokeWidth={2.5} />
          Search
        </button>
      </div>
    </section>
  );
}
