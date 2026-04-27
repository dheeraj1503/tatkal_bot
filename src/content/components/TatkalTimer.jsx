import React, { useState, useEffect, useRef } from 'react';
import { Info } from 'lucide-react';

function getTimeUntilTatkal(mode) {
  const now = new Date();
  const target = new Date();
  
  const targetHour = mode === 'AC' ? 10 : 11;
  const hour = now.getHours();
  
  // If current time is before the target time today
  if (hour < targetHour) {
    target.setHours(targetHour, 0, 0, 0);
  } else {
    // Next day
    target.setDate(target.getDate() + 1);
    target.setHours(targetHour, 0, 0, 0);
  }
  
  return Math.max(0, target - now);
}

function fmtMs(ms) {
  const totalSec = Math.floor(ms / 1000);
  const h = String(Math.floor(totalSec / 3600)).padStart(2, '0');
  const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
  const s = String(totalSec % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

export default function TatkalTimer() {
  const [mode, setMode] = useState('AC'); // AC | SL
  const [remaining, setRemaining] = useState(getTimeUntilTatkal('AC'));
  const timerRef = useRef(null);

  useEffect(() => {
    // Update immediately when mode changes
    setRemaining(getTimeUntilTatkal(mode));
    
    // Clear any existing interval before setting a new one
    if (timerRef.current) clearInterval(timerRef.current);
    
    timerRef.current = setInterval(() => {
      setRemaining(getTimeUntilTatkal(mode));
    }, 1000);
    
    return () => clearInterval(timerRef.current);
  }, [mode]);

  const totalWindow = 3600 * 1000; // 1 hour reference for progress
  const progress = Math.min(100, Math.max(0, ((totalWindow - remaining) / totalWindow) * 100));

  return (
    <section className="relative bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/20 rounded-2xl p-4 border-l-4 border-brand-saffron shadow-sm">
      <div className="flex justify-between items-start mb-3">
        {/* Countdown */}
        <div>
          <p className="text-[9px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest mb-1">
            Tatkal window opens in
          </p>
          <p className="font-mono text-[28px] font-bold text-brand-saffron leading-none tracking-tighter">
            {fmtMs(remaining)}
          </p>
        </div>

        {/* AC / SL toggle */}
        <div className="flex bg-white/70 dark:bg-gray-900/50 p-1 rounded-xl border border-orange-100 dark:border-orange-900/40 gap-1">
          {['AC', 'SL'].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                mode === m
                  ? 'bg-brand-saffron text-white shadow-sm'
                  : 'text-orange-700 dark:text-orange-400 hover:bg-orange-100/50 dark:hover:bg-orange-900/20'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-orange-200/60 dark:bg-orange-900/30 h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-brand-saffron h-full rounded-full transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Info hint */}
      <p className="flex items-center gap-1.5 text-[10px] text-orange-700/80 dark:text-orange-400/80 mt-2.5 font-medium">
        <Info size={12} />
        {mode === 'AC' ? 'AC Tatkal opens at 10:00 AM' : 'SL Tatkal opens at 11:00 AM'}
      </p>
    </section>
  );
}
