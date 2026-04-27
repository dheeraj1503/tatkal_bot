import React from 'react';
import { Phone, Zap } from 'lucide-react';
import { fillContact } from '../utils/autofill';

export default function ContactSection({ contact, onChange }) {
  const update = (field, val) => onChange({ ...contact, [field]: val });

  return (
    <section className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between px-0.5">
        <div className="flex items-center gap-2">
          <Phone size={18} className="text-brand-blue" />
          <h3 className="text-[15px] font-bold text-gray-800 dark:text-white">Contact Details</h3>
        </div>
        <button 
          onClick={() => fillContact(contact.mobile)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 dark:bg-blue-950/40 text-brand-blue dark:text-blue-400 text-[11px] font-bold rounded-lg border border-blue-100/50 dark:border-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors shadow-sm"
        >
          <Zap size={13} strokeWidth={2.5} className="fill-brand-blue dark:fill-blue-400" />
          Fill
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 rounded-2xl p-4 shadow-sm">
        <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">MOBILE NUMBER</label>
        <div className="flex items-center gap-2">
          <span className="text-gray-400 font-bold bg-gray-50 dark:bg-gray-700 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600">+91</span>
          <input
            type="text"
            value={contact.mobile}
            onChange={e => update('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
            placeholder="Passenger Mobile Number"
            className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl px-3.5 py-2.5 text-[13px] font-semibold text-gray-800 dark:text-white outline-none focus:border-brand-blue/50 focus:ring-2 focus:ring-brand-blue/10 transition-all placeholder-gray-400"
          />
        </div>
      </div>
    </section>
  );
}
