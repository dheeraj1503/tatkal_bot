import React, { useState } from 'react';
import { Zap, Eye, EyeOff } from 'lucide-react';
import { fillCredentials } from '../utils/autofill';

export default function CredentialsSection({ credentials, onChange }) {
  const [showPass, setShowPass] = useState(false);

  const update = (field, val) => onChange({ ...credentials, [field]: val });

  const handleFill = () => {
    fillCredentials(credentials.username, credentials.password);
  };

  return (
    <section className="flex flex-col gap-3">
      {/* Section header */}
      <div className="flex items-center justify-between px-0.5">
        <h3 className="text-[13px] font-bold text-gray-800 dark:text-white">IRCTC Credentials</h3>
        <button
          onClick={handleFill}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/40 text-brand-blue dark:text-blue-400 rounded-lg border border-blue-100 dark:border-blue-900/40 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all text-[11px] font-bold"
        >
          <Zap size={13} strokeWidth={2.5} className="fill-brand-blue dark:fill-blue-400" />
          Fill
        </button>
      </div>

      {/* Username + Password side-by-side */}
      <div className="grid grid-cols-2 gap-3">
        {/* Username */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 border border-gray-100 dark:border-gray-700 focus-within:ring-2 focus-within:ring-brand-blue/40 transition-all">
          <label className="block text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
            Username
          </label>
          <input
            type="text"
            value={credentials.username}
            onChange={e => update('username', e.target.value)}
            placeholder="Enter username"
            className="w-full bg-transparent border-none outline-none text-[13px] font-semibold text-gray-800 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 p-0"
          />
        </div>

        {/* Password */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 border border-gray-100 dark:border-gray-700 focus-within:ring-2 focus-within:ring-brand-blue/40 transition-all relative">
          <label className="block text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
            Password
          </label>
          <div className="flex items-center gap-1">
            <input
              type={showPass ? 'text' : 'password'}
              value={credentials.password}
              onChange={e => update('password', e.target.value)}
              placeholder="••••••••"
              className="w-full bg-transparent border-none outline-none text-[13px] font-semibold text-gray-800 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 p-0 min-w-0"
            />
            <button
              type="button"
              onClick={() => setShowPass(v => !v)}
              className="text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 flex-shrink-0"
            >
              {showPass ? <EyeOff size={12} /> : <Eye size={12} />}
            </button>
          </div>
        </div>
      </div>


    </section>
  );
}
