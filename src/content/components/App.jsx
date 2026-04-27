import React, { useState, useEffect, useCallback } from 'react';
import Header from './Header';
import TatkalTimer from './TatkalTimer';
import TicketTabs from './TicketTabs';
import CredentialsSection from './CredentialsSection';
import JourneySection from './JourneySection';
import TrainSection from './TrainSection';
import PassengerSection from './PassengerSection';
import ContactSection from './ContactSection';
import PaymentSection from './PaymentSection';
import { getTickets, saveTickets, getDarkMode, saveDarkMode } from '../../utils/storage';
import { findAndHighlightTrain } from '../utils/autofill';

const makeTicket = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tzOffset = tomorrow.getTimezoneOffset() * 60000;
  const tomorrowLocal = new Date(tomorrow.getTime() - tzOffset).toISOString().split('T')[0];

  return {
    id: Date.now() + Math.random(),
    credentials: { username: '', password: '' },
    journey: {
      from: '', fromName: '',
      to: '',   toName: '',
      date: tomorrowLocal,
      trainClass: '3A',
      quota: 'TATKAL',
      trainNumber: '',
    },
    passengers: [
      { name: '', age: '', gender: 'Male', berth: 'No Pref' },
    ],
    contact: { mobile: '' },
    payment: { method: 'UPI', upiId: '' },
  };
};

export default function App({ shadowRoot }) {
  const [darkMode,     setDarkMode]     = useState(false);
  const [tickets,      setTickets]      = useState([makeTicket()]);
  const [activeIdx,    setActiveIdx]    = useState(0);
  const [collapsed,    setCollapsed]    = useState(false);
  const [loaded,       setLoaded]       = useState(false);

  const ticket = tickets[activeIdx] ?? tickets[0];

  /* ── Load from storage ── */
  useEffect(() => {
    (async () => {
      const [savedTickets, savedDark] = await Promise.all([getTickets(), getDarkMode()]);
      if (savedTickets?.length) setTickets(savedTickets);
      if (savedDark != null)    setDarkMode(savedDark);
      setLoaded(true);
    })();
  }, []);

  /* ── Persist tickets ── */
  useEffect(() => {
    if (loaded) saveTickets(tickets);
  }, [tickets, loaded]);

  /* ── Dark mode class on shadow host ── */
  useEffect(() => {
    if (!shadowRoot) return;
    const host = shadowRoot.host;
    host.classList.toggle('dark', darkMode);
  }, [darkMode, shadowRoot]);

  /* ── Auto-highlight train on results page ── */
  useEffect(() => {
    if (!loaded) return;
    
    const checkAndHighlight = () => {
      if (window.location.href.includes('/booking/train-list')) {
        const trainNum = ticket?.journey?.trainNumber;
        if (trainNum) {
          findAndHighlightTrain(trainNum);
        }
      }
    };

    // Run once on mount/load
    checkAndHighlight();

    // Safer URL monitoring for SPAs
    let lastUrl = window.location.href;
    const timer = setInterval(() => {
      if (window.location.href !== lastUrl) {
        lastUrl = window.location.href;
        checkAndHighlight();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [loaded, ticket?.journey?.trainNumber]);

  const toggleDark = useCallback(async () => {
    const next = !darkMode;
    setDarkMode(next);
    await saveDarkMode(next);
  }, [darkMode]);
  const updateTicket = useCallback((fn) => {
    setTickets(prev => {
      const next = [...prev];
      next[activeIdx] = fn(next[activeIdx]);
      return next;
    });
  }, [activeIdx]);

  const addTicket = () => {
    const t = makeTicket();
    setTickets(prev => [...prev, t]);
    setActiveIdx(tickets.length);
  };

  const deleteTicket = (idx) => {
    if (tickets.length <= 1) return;
    setTickets(prev => prev.filter((_, i) => i !== idx));
    setActiveIdx(prev => (prev >= idx && prev > 0 ? prev - 1 : prev));
  };

  if (!loaded) return null;

  return (
    <div className={darkMode ? 'dark' : ''}>
      {/* Collapsed tab */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="fixed right-0 top-1/2 -translate-y-1/2 w-7 h-16 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 border-r-0 rounded-l-xl shadow-xl flex items-center justify-center text-gray-400 dark:text-gray-300 hover:text-brand-blue transition-colors z-[2147483647]"
          title="Open RailAssist"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}

      {/* Main panel */}
      {!collapsed && (
        <div className="ra-panel fixed top-0 right-0 w-[380px] h-screen flex flex-col bg-white dark:bg-gray-900 shadow-2xl border-l border-gray-100 dark:border-gray-800 z-[2147483646] font-sans">
          
          {/* Expanded tab handle */}
          <button
            onClick={() => setCollapsed(true)}
            className="absolute top-1/2 -left-7 -translate-y-1/2 w-7 h-16 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 border-r-0 rounded-l-xl shadow-[-5px_0_15px_-5px_rgba(0,0,0,0.1)] flex items-center justify-center text-gray-400 dark:text-gray-300 hover:text-brand-blue transition-colors z-[2147483647]"
            title="Collapse RailAssist"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          <Header darkMode={darkMode} onToggleDark={toggleDark} />

          <div className="flex-1 overflow-y-auto ra-scroll">
            <div className="p-4 flex flex-col gap-5">
              <TatkalTimer />
              <TicketTabs
                tickets={tickets}
                activeIdx={activeIdx}
                onSelect={setActiveIdx}
                onAdd={addTicket}
                onDelete={deleteTicket}
              />
              <CredentialsSection
                credentials={ticket.credentials}
                onChange={(creds) => updateTicket(t => ({ ...t, credentials: creds }))}
              />
              <JourneySection
                journey={ticket.journey}
                onChange={(j) => updateTicket(t => ({ ...t, journey: j }))}
              />
              <TrainSection
                journey={ticket.journey}
                onChange={(j) => updateTicket(t => ({ ...t, journey: j }))}
              />
              <PassengerSection
                passengers={ticket.passengers}
                onChange={(ps) => updateTicket(t => ({ ...t, passengers: ps }))}
              />
              <ContactSection
                contact={ticket.contact || { mobile: '' }}
                onChange={(c) => updateTicket(t => ({ ...t, contact: c }))}
              />
              <PaymentSection
                payment={ticket.payment}
                onChange={(p) => updateTicket(t => ({ ...t, payment: p }))}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
