import React, { useState } from 'react';
import { User, Zap, Pencil, Trash2, Check, X } from 'lucide-react';

const BERTH_OPTIONS  = ['No Pref', 'Lower', 'Middle', 'Upper', 'Side Lower', 'Side Upper'];
const GENDER_OPTIONS = ['Male', 'Female', 'Transgender'];

export default function PassengerCard({ passenger, index, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draft,   setDraft]   = useState(passenger);

  const save = () => { onUpdate(draft); setEditing(false); };
  const cancel = () => { setDraft(passenger); setEditing(false); };

  if (editing) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-brand-blue/40 rounded-2xl p-4 shadow-sm animate-fade-in">
        {/* Edit form */}
        <div className="flex flex-col gap-3">
          {/* Name */}
          <div>
            <label className="block text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Full Name</label>
            <input
              autoFocus
              value={draft.name}
              onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
              placeholder="Enter passenger name"
              className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-[13px] font-semibold text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-brand-blue/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Age */}
            <div>
              <label className="block text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Age</label>
              <input
                type="number"
                value={draft.age}
                onChange={e => setDraft(d => ({ ...d, age: e.target.value }))}
                placeholder="Enter age"
                min="1" max="120"
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-[13px] font-semibold text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-brand-blue/30"
              />
            </div>
            {/* Gender */}
            <div>
              <label className="block text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Gender</label>
              <select
                value={draft.gender}
                onChange={e => setDraft(d => ({ ...d, gender: e.target.value }))}
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-[13px] font-semibold text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-brand-blue/30"
              >
                {GENDER_OPTIONS.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
          </div>

          {/* Berth */}
          <div>
            <label className="block text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Berth Preference</label>
            <div className="flex flex-wrap gap-1.5">
              {BERTH_OPTIONS.map(b => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setDraft(d => ({ ...d, berth: b }))}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    draft.berth === b
                      ? 'bg-brand-blue text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Save / Cancel */}
          <div className="flex gap-2 mt-1">
            <button
              onClick={save}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-brand-blue text-white rounded-xl text-[12px] font-bold hover:bg-blue-700 transition-colors"
            >
              <Check size={13} strokeWidth={2.5} /> Save
            </button>
            <button
              onClick={cancel}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl text-[12px] font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <X size={13} strokeWidth={2.5} /> Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── View mode ── */
  return (
    <div className="group bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 rounded-2xl p-4 shadow-sm hover:border-gray-200 dark:hover:border-gray-600 transition-all">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="w-11 h-11 flex-shrink-0 rounded-2xl bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 flex items-center justify-center text-gray-400 dark:text-gray-500">
          <User size={22} strokeWidth={1.5} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-bold text-gray-900 dark:text-white truncate">
            {passenger.name || `Passenger ${index + 1}`}
          </p>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 font-semibold mt-0.5 uppercase tracking-wide">
            {[passenger.age, passenger.gender, passenger.berth].filter(Boolean).join(' • ')}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            title="Auto-fill"
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40 text-brand-blue dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            <Zap size={14} strokeWidth={2.5} />
          </button>
          <button
            onClick={() => { setDraft(passenger); setEditing(true); }}
            title="Edit"
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <Pencil size={14} strokeWidth={2} />
          </button>
          <button
            onClick={onDelete}
            title="Delete"
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-red-50 dark:bg-red-950/30 text-red-400 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
          >
            <Trash2 size={14} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}
