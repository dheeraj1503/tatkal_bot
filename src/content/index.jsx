import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import styles from './index.css?inline';

const SIDEBAR_ID = 'rail-assist-host';

function mountSidebar() {
  if (document.getElementById(SIDEBAR_ID)) return;

  // Create host element
  const host = document.createElement('div');
  host.id = SIDEBAR_ID;
  Object.assign(host.style, {
    position: 'fixed',
    top: '0',
    right: '0',
    width: '380px',
    height: '100vh',
    zIndex: '2147483647',
    pointerEvents: 'none', // let the panel itself handle pointer events
  });
  document.body.appendChild(host);

  // Attach shadow DOM for full CSS isolation
  const shadow = host.attachShadow({ mode: 'open' });

  // Inject compiled Tailwind CSS into shadow root
  const styleEl = document.createElement('style');
  styleEl.textContent = styles;
  shadow.appendChild(styleEl);

  // Mount point for React
  const mountEl = document.createElement('div');
  mountEl.style.pointerEvents = 'auto';
  shadow.appendChild(mountEl);

  // Mount React app
  const root = createRoot(mountEl);
  root.render(<App shadowRoot={shadow} />);
}

// Listen for toggle message from background service worker
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'TOGGLE_SIDEBAR') {
    const host = document.getElementById(SIDEBAR_ID);
    if (host) {
      host.style.display = host.style.display === 'none' ? '' : 'none';
    }
  }
});

// Inject on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountSidebar);
} else {
  mountSidebar();
}
