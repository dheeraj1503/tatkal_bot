export const fillJourney = async (journey) => {
  const { from, to, date, trainClass, quota } = journey;

  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  const waitForSelector = (selector, timeout = 3000) => {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      const check = () => {
        const el = document.querySelector(selector);
        if (el) resolve(el);
        else if (Date.now() - start > timeout) resolve(null);
        else setTimeout(check, 50);
      };
      check();
    });
  };

  const trigger = (el, type) => {
    el.dispatchEvent(new Event(type, { bubbles: true }));
  };

  const selectStation = async (labelPart, value) => {
    const input = document.querySelector(`input[aria-label*="${labelPart}"]`);
    if (!input || !value) return;

    input.focus();
    input.click();
    input.value = '';
    trigger(input, 'input');
    
    await wait(50);
    input.value = value;
    trigger(input, 'input');
    trigger(input, 'keydown');

    const option = await waitForSelector('li.ui-autocomplete-list-item', 1500);
    if (option) {
      option.click();
      console.log(`RailAssist: Selected ${labelPart} ${value}`);
    }
  };

  const selectDropdownOption = async (containerSelector, targetValue, retries = 3) => {
    for (let i = 0; i < retries; i++) {
      const container = document.querySelector(containerSelector);
      if (!container) {
        await wait(200);
        continue;
      }

      const triggerBtn = container.querySelector('.ui-dropdown-trigger') || container;
      triggerBtn.click();
      
      // Wait for the dropdown panel to appear and stabilize
      await wait(500);
      
      // Only look at visible items to avoid picking up leftover options from other dropdowns
      const allItems = Array.from(document.querySelectorAll('li.ui-dropdown-item'));
      const visibleItems = allItems.filter(el => {
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden' && el.offsetParent !== null;
      });

      const match = visibleItems.find(item => {
        const text = item.textContent?.trim().toUpperCase() || '';
        const label = item.getAttribute('aria-label')?.trim().toUpperCase() || '';
        const val = targetValue.toUpperCase();
        return text === val || label === val || text.includes(val) || label.includes(val);
      });

      if (match) {
        match.click();
        
        trigger(container, 'change');
        trigger(container, 'input');
        const hiddenInput = container.querySelector('input[type="hidden"]') || container.querySelector('select');
        if (hiddenInput) {
          trigger(hiddenInput, 'change');
          trigger(hiddenInput, 'input');
        }

        console.log(`RailAssist: Successfully selected ${targetValue}`);
        return true;
      }
      
      console.warn(`RailAssist: Selection attempt ${i+1} for ${targetValue} failed, retrying...`);
      document.body.click(); // Close any stuck overlays
      await wait(300);
    }
    return false;
  };

  // 1. Stations
  selectStation('From station', from);
  await wait(400); 
  await selectStation('To station', to);

  // 2. Date
  const dateInput = document.querySelector('p-calendar input');
  if (dateInput && date) {
    const [y, m, d] = date.split('-');
    const formattedDate = `${d}/${m}/${y}`;
    dateInput.value = formattedDate;
    trigger(dateInput, 'input');
    trigger(dateInput, 'change');
    dateInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
  }

  // 3. Class
  await wait(300);
  await selectDropdownOption('p-dropdown[formcontrolname="journeyClass"]', trainClass);

  // 4. Quota
  await wait(400);
  await selectDropdownOption('p-dropdown[formcontrolname="journeyQuota"]', quota);

  // 5. Highlight Search Button
  await wait(500);
  const searchBtn = document.querySelector('button.train_Search');
  if (searchBtn) {
    searchBtn.style.transition = 'all 0.3s ease';
    searchBtn.style.boxShadow = '0 0 20px 5px rgba(251, 146, 60, 0.8)'; // Brand orange glow
    searchBtn.style.transform = 'scale(1.05)';
    searchBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Add a pulse animation
    searchBtn.animate([
      { boxShadow: '0 0 0px 0px rgba(251, 146, 60, 0)' },
      { boxShadow: '0 0 20px 10px rgba(251, 146, 60, 0.6)' },
      { boxShadow: '0 0 0px 0px rgba(251, 146, 60, 0)' }
    ], {
      duration: 1500,
      iterations: Infinity
    });
    
    console.log('RailAssist: Highlighted search button');
  }

  console.log('RailAssist: Universal journey fill sequence complete');
};

export const findAndHighlightTrain = async (trainNumber) => {
  if (!trainNumber) return;

  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  // 2. WAIT FOR TRAIN LIST
  let attempts = 0;
  let cards = [];
  const selector = ".form-group.no-pad.col-xs-12.bull-back.border-all";
  
  while (attempts < 20) {
    cards = Array.from(document.querySelectorAll(selector));
    if (cards.length > 0) break;
    await wait(500);
    attempts++;
  }

  if (cards.length === 0) {
    console.warn('RailAssist: No train cards found on page with selector: ' + selector);
    return;
  }

  // 4. MATCH TRAIN NUMBER
  let targetCard = null;
  for (const card of cards) {
    const strongEl = card.querySelector('strong');
    if (strongEl) {
      const text = strongEl.textContent;
      const match = text.match(/\((\d{5})\)/);
      if (match && match[1] === trainNumber) {
        targetCard = card;
        break;
      }
    }
  }

  // 5. SCROLL TO MATCH
  if (targetCard) {
    console.log(`RailAssist: Found and matching train ${trainNumber}`);
    
    targetCard.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
    
    // 6. HIGHLIGHT MATCHED TRAIN
    targetCard.style.border = "2px solid #ff6600";
    targetCard.style.boxShadow = "0 0 10px rgba(255,102,0,0.6)";
    targetCard.style.transition = "all 0.3s ease";
    
    // Optional: temporary background highlight
    const originalBg = targetCard.style.backgroundColor;
    targetCard.style.backgroundColor = "rgba(255, 102, 0, 0.05)";
    
    // Add Ra-Highlight label if not present
    if (!targetCard.querySelector('.ra-highlight-label')) {
      const label = document.createElement('div');
      label.className = 'ra-highlight-label';
      label.textContent = 'SELECTED TRAIN';
      label.style.cssText = `
        position: absolute;
        top: -10px;
        left: 15px;
        background: #ff6600;
        color: white;
        padding: 1px 8px;
        border-radius: 4px;
        font-size: 9px;
        font-weight: bold;
        z-index: 5;
      `;
      targetCard.style.position = 'relative';
      targetCard.appendChild(label);
    }
  } else {
    console.warn(`RailAssist: Train ${trainNumber} not found in DOM`);
  }
};

export const fillCredentials = (username, password) => {
  const findAndFill = () => {
    const userField = 
      document.querySelector('input[formcontrolname="userId"]') || 
      document.querySelector('input[formcontrolname="userid"]') || 
      document.querySelector('input[id="userId"]') ||
      document.querySelector('input[placeholder*="User Name" i]');
      
    const passField = 
      document.querySelector('input[formcontrolname="password"]') || 
      document.querySelector('input[id="pwd"]') ||
      document.querySelector('input[placeholder*="Password" i]');

    let filled = false;

    if (userField && username) {
      userField.value = username;
      userField.dispatchEvent(new Event('input', { bubbles: true }));
      userField.dispatchEvent(new Event('change', { bubbles: true }));
      filled = true;
    }

    if (passField && password) {
      passField.value = password;
      passField.dispatchEvent(new Event('input', { bubbles: true }));
      passField.dispatchEvent(new Event('change', { bubbles: true }));
      filled = true;
    }

    if (filled) {
      console.log('RailAssist: Successfully filled credentials');
      return true;
    }
    return false;
  };

  // Try immediately
  if (findAndFill()) return true;

  // If not found, look for login button and click it if it exists
  const loginBtn = Array.from(document.querySelectorAll('a, button')).find(el => 
    el.textContent.includes('LOGIN') || el.innerText.includes('LOGIN')
  );
  
  if (loginBtn) {
    console.log('RailAssist: Login fields not found, clicking LOGIN button...');
    loginBtn.click();
  }

  // Poll for fields for up to 3 seconds
  let attempts = 0;
  const interval = setInterval(() => {
    attempts++;
    if (findAndFill() || attempts > 30) {
      clearInterval(interval);
      if (attempts > 30) console.warn('RailAssist: Could not find login fields after timeout');
    }
  }, 100);

  return true;
};
