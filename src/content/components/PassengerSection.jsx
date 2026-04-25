import React from 'react';
import { Zap, Plus, User, ChevronUp } from 'lucide-react';
import PassengerCard from './PassengerCard';

const NEW_PASSENGER = () => ({ name: '', age: '', gender: 'Male', berth: 'No Pref' });

export default function PassengerSection({ passengers, onChange }) {
  const add = () => onChange([...passengers, NEW_PASSENGER()]);

  const update = (idx, updated) => {
    const next = [...passengers];
    next[idx] = updated;
    onChange(next);
  };

  const remove = (idx) => {
    if (passengers.length <= 1) return;
    onChange(passengers.filter((_, i) => i !== idx));
  };

  return (
    <section className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex flex-col border-b border-gray-100 dark:border-gray-700/50 pb-2">
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center gap-2">
            <User size={18} className="text-brand-blue" />
            <h3 className="text-[15px] font-bold text-gray-800 dark:text-white">Passenger Details</h3>
          </div>
          <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-all text-[12px] font-bold shadow-sm">
            <Zap size={13} strokeWidth={2.5} className="fill-white" />
            Fill All
          </button>
        </div>
        <div className="flex justify-center text-gray-300 dark:text-gray-600 mt-1">
          <ChevronUp size={18} />
        </div>
      </div>

      {/* Passenger cards */}
      <div className="flex flex-col gap-3">
        {passengers.map((p, i) => (
          <PassengerCard
            key={i}
            index={i}
            passenger={p}
            onUpdate={(updated) => update(i, updated)}
            onDelete={() => remove(i)}
          />
        ))}
      </div>

      {/* Add passenger */}
      <div className="border-t border-gray-100 dark:border-gray-700/50 pt-3">
        <button
          onClick={add}
          className="w-full py-3 bg-blue-50/50 dark:bg-blue-950/20 text-brand-blue dark:text-blue-400 rounded-xl font-semibold text-[13px] flex items-center justify-center gap-2 hover:bg-blue-100/60 dark:hover:bg-blue-900/30 transition-all"
        >
          <Plus size={16} strokeWidth={2} />
          Add Passenger
        </button>
      </div>
    </section>
  );
}
