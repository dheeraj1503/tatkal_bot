import React from 'react';
import { Zap, PlusCircle } from 'lucide-react';
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
      <div className="flex items-center justify-between px-0.5">
        <h3 className="text-[13px] font-bold text-gray-800 dark:text-white">Passenger Details</h3>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/40 text-brand-blue dark:text-blue-400 rounded-lg border border-blue-100 dark:border-blue-900/40 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all text-[11px] font-bold">
          <Zap size={13} strokeWidth={2.5} className="fill-brand-blue dark:fill-blue-400" />
          Fill All
        </button>
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
      <button
        onClick={add}
        className="w-full py-3.5 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl text-gray-400 dark:text-gray-600 font-bold text-[12px] flex items-center justify-center gap-2 hover:border-brand-blue hover:text-brand-blue dark:hover:border-blue-500 dark:hover:text-blue-400 hover:bg-blue-50/30 dark:hover:bg-blue-950/20 transition-all"
      >
        <PlusCircle size={18} strokeWidth={2} />
        Add New Passenger
      </button>
    </section>
  );
}
