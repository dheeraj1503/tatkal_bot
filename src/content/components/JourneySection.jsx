import React, { useState } from 'react';
import { Zap, ArrowDownUp, ChevronDown } from 'lucide-react';
import { fillJourney } from '../utils/autofill';

const CLASS_OPTIONS  = ['SL', '3A', '2A', '1A', 'CC', '2S', 'EC'];
const QUOTA_OPTIONS  = ['GENERAL', 'TATKAL', 'PREMIUM TATKAL', 'LADIES', 'LOWER BERTH'];

const STATION_NAMES = {
  NDLS: 'New Delhi',   BCT: 'Mumbai Central', MMCT: 'Mumbai Central',
  MAS:  'Chennai',     SBC: 'Bengaluru',       HWH: 'Howrah',
  PUNE: 'Pune',        ADI: 'Ahmedabad',       JP:  'Jaipur',
  LKO:  'Lucknow',     PNBE:'Patna',           BBS: 'Bhubaneswar',
  SBIB: 'Sabarmati BG', NZM: 'Hazrat Nizamuddin',
};

function stationName(code) {
  return STATION_NAMES[code?.toUpperCase()] || '';
}

export default function JourneySection({ journey, onChange }) {
  const [classOpen,  setClassOpen]  = useState(false);
  const [quotaOpen,  setQuotaOpen]  = useState(false);

  const update = (field, val) => onChange({ ...journey, [field]: val });

  const swap = () => onChange({
    ...journey,
    from: journey.to,   fromName: journey.toName,
    to:   journey.from, toName:   journey.fromName,
  });

  const handleFill = () => {
    fillJourney(journey);
  };

  return (
    <section className="bg-white dark:bg-gray-800/60 rounded-2xl p-4 border border-gray-100 dark:border-gray-700/50 shadow-sm flex flex-col gap-4">
      {/* Section header */}
      <div className="flex items-center justify-between px-0.5">
        <h3 className="text-[13px] font-bold text-gray-800 dark:text-white uppercase tracking-tight">Journey Details</h3>
        <button
          onClick={handleFill}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/40 text-brand-blue dark:text-blue-400 rounded-lg border border-blue-100 dark:border-blue-900/40 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all text-[11px] font-bold"
        >
          <Zap size={13} strokeWidth={2.5} className="fill-brand-blue dark:fill-blue-400" />
          Fill
        </button>
      </div>

      {/* FROM / TO with swap */}
      <div className="relative flex flex-col gap-2">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 border border-gray-100 dark:border-gray-700 focus-within:ring-2 focus-within:ring-brand-blue/40 transition-all">
          <div className="flex items-center justify-between mb-1">
            <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">FROM</label>
            {journey.fromName && <span className="text-[10px] text-brand-blue dark:text-blue-400 font-bold uppercase tracking-wider">{journey.fromName}</span>}
          </div>
          <input
            value={journey.from}
            onChange={e => {
              const v = e.target.value.toUpperCase();
              onChange({ ...journey, from: v, fromName: STATION_NAMES[v] || '' });
            }}
            placeholder="ENTER SOURCE"
            maxLength={6}
            className="w-full bg-transparent border-none outline-none text-[18px] font-bold text-gray-800 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 p-0 uppercase"
          />
        </div>

        {/* Swap button */}
        <button
          onClick={swap}
          className="absolute right-6 top-1/2 -translate-y-1/2 w-8 h-8 bg-white dark:bg-gray-800 text-brand-blue dark:text-blue-400 rounded-full flex items-center justify-center shadow-md border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 active:rotate-180 transition-all z-10"
        >
          <ArrowDownUp size={16} strokeWidth={2.5} />
        </button>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 border border-gray-100 dark:border-gray-700 focus-within:ring-2 focus-within:ring-brand-blue/40 transition-all">
          <div className="flex items-center justify-between mb-1">
            <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">TO</label>
            {journey.toName && <span className="text-[10px] text-brand-blue dark:text-blue-400 font-bold uppercase tracking-wider">{journey.toName}</span>}
          </div>
          <input
            value={journey.to}
            onChange={e => {
              const v = e.target.value.toUpperCase();
              onChange({ ...journey, to: v, toName: STATION_NAMES[v] || '' });
            }}
            placeholder="ENTER DESTINATION"
            maxLength={6}
            className="w-full bg-transparent border-none outline-none text-[18px] font-bold text-gray-800 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 p-0 uppercase"
          />
        </div>
      </div>

      {/* Date + Class + Quota */}
      <div className="grid grid-cols-2 gap-3">
        {/* Date */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl px-3.5 py-3 border border-gray-100 dark:border-gray-700/50">
          <label className="block text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Departure</label>
          <div className="flex items-center gap-2 flex-wrap">
            <input
              type="date"
              value={journey.date}
              onChange={e => update('date', e.target.value)}
              className="bg-transparent border-none outline-none text-[12px] font-bold text-gray-800 dark:text-white p-0 w-full"
            />
          </div>
        </div>

        {/* Class + Quota stacked */}
        <div className="flex flex-col gap-2">
          {/* Class dropdown */}
          <div className="relative">
            <button
              onClick={() => { setClassOpen(v => !v); setQuotaOpen(false); }}
              className="w-full bg-gray-50 dark:bg-gray-800 rounded-xl px-3.5 py-2.5 border border-gray-100 dark:border-gray-700/50 flex items-center justify-between text-[12px] font-bold text-gray-800 dark:text-white"
            >
              {journey.trainClass || '3A'}
              <ChevronDown size={13} className={`text-gray-400 transition-transform ${classOpen ? 'rotate-180' : ''}`} />
            </button>
            {classOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in">
                {CLASS_OPTIONS.map(c => (
                  <button
                    key={c}
                    onClick={() => { update('trainClass', c); setClassOpen(false); }}
                    className={`w-full text-left px-3.5 py-2 text-[12px] font-semibold transition-colors ${
                      journey.trainClass === c
                        ? 'bg-brand-blue text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >{c}</button>
                ))}
              </div>
            )}
          </div>

          {/* Quota dropdown */}
          <div className="relative">
            <button
              onClick={() => { setQuotaOpen(v => !v); setClassOpen(false); }}
              className="w-full bg-orange-50/80 dark:bg-orange-950/20 rounded-xl px-3.5 py-2.5 border border-orange-100 dark:border-orange-900/40 flex items-center justify-between text-[12px] font-bold text-brand-saffron"
            >
              {journey.quota === 'TATKAL' ? 'Tatkal' : journey.quota === 'GENERAL' ? 'General' : journey.quota}
              <ChevronDown size={13} className={`transition-transform ${quotaOpen ? 'rotate-180' : ''}`} />
            </button>
            {quotaOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in">
                {QUOTA_OPTIONS.map(q => (
                  <button
                    key={q}
                    onClick={() => { update('quota', q); setQuotaOpen(false); }}
                    className={`w-full text-left px-3.5 py-2 text-[12px] font-semibold transition-colors ${
                      journey.quota === q
                        ? 'bg-brand-saffron text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >{q.charAt(0) + q.slice(1).toLowerCase()}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
