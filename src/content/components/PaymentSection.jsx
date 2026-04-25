import React, { useState } from 'react';
import { QrCode, CreditCard } from 'lucide-react';

export default function PaymentSection({ payment, onChange }) {
  const [tab, setTab] = useState(payment.method || 'UPI');
  const update = (field, val) => onChange({ ...payment, [field]: val });

  const handleTabSwitch = (t) => {
    setTab(t);
    update('method', t);
  };

  return (
    <section className="flex flex-col gap-3 pb-4">
      {/* Header */}
      <h3 className="text-[13px] font-bold text-gray-800 dark:text-white px-0.5">Fast Payment</h3>

      {/* UPI / Card tabs */}
      <div className="flex p-1.5 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 gap-1">
        {['UPI', 'Card'].map(t => (
          <button
            key={t}
            onClick={() => handleTabSwitch(t)}
            className={`flex-1 py-2.5 rounded-xl text-[12px] font-bold transition-all ${
              tab === t
                ? 'bg-white dark:bg-gray-700 text-brand-blue dark:text-blue-400 shadow-sm border border-gray-100 dark:border-gray-600'
                : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* UPI input */}
      {tab === 'UPI' && (
        <div className="flex gap-2 animate-fade-in">
          <div className="flex-1 flex items-center gap-2 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-3 focus-within:ring-2 focus-within:ring-brand-blue/30 transition-all">
            <QrCode size={18} strokeWidth={1.5} className="text-gray-400 dark:text-gray-500 flex-shrink-0" />
            <input
              type="text"
              value={payment.upiId || ''}
              onChange={e => update('upiId', e.target.value)}
              placeholder="rahulsharma@oksbi"
              className="flex-1 bg-transparent border-none outline-none py-3.5 text-[13px] font-semibold text-gray-800 dark:text-white placeholder-gray-300 dark:placeholder-gray-600"
            />
          </div>
          <button className="px-6 bg-brand-blue hover:bg-blue-700 active:scale-95 text-white font-bold text-[13px] rounded-xl shadow-md shadow-blue-500/20 transition-all">
            Fill
          </button>
        </div>
      )}

      {/* Card input */}
      {tab === 'Card' && (
        <div className="flex flex-col gap-3 animate-fade-in">
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-3 focus-within:ring-2 focus-within:ring-brand-blue/30 transition-all">
            <CreditCard size={18} strokeWidth={1.5} className="text-gray-400 dark:text-gray-500 flex-shrink-0" />
            <input
              type="text"
              value={payment.cardNumber || ''}
              onChange={e => update('cardNumber', e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim())}
              placeholder="•••• •••• •••• ••••"
              className="flex-1 bg-transparent border-none outline-none py-3.5 text-[13px] font-semibold text-gray-800 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 tracking-widest"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={payment.cardExpiry || ''}
              onChange={e => {
                let v = e.target.value.replace(/\D/g, '').slice(0, 4);
                if (v.length >= 3) v = v.slice(0,2) + '/' + v.slice(2);
                update('cardExpiry', v);
              }}
              placeholder="MM / YY"
              className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-3 py-3 text-[13px] font-semibold text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-brand-blue/30 placeholder-gray-300 dark:placeholder-gray-600"
            />
            <input
              type="password"
              value={payment.cardCvv || ''}
              onChange={e => update('cardCvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="CVV"
              className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-3 py-3 text-[13px] font-semibold text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-brand-blue/30 placeholder-gray-300 dark:placeholder-gray-600"
            />
          </div>
          <button className="w-full py-3 bg-brand-blue hover:bg-blue-700 active:scale-95 text-white font-bold text-[13px] rounded-xl shadow-md shadow-blue-500/20 transition-all">
            Fill Card Details
          </button>
        </div>
      )}
    </section>
  );
}
