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
    // 1. Identify common variations for From/To station selectors
    const isFrom = labelPart.toLowerCase().includes('from');
    const selectors = [
      // Standard homepage
      `input[aria-label*="${labelPart}"]`,
      // Result page variations
      `p-autocomplete[formcontrolname="${isFrom ? 'fromStation' : 'toStation'}"] input`,
      `p-autocomplete[formcontrolname="${isFrom ? 'origin' : 'destination'}"] input`,
      // General fallbacks
      `input[placeholder*="${labelPart}"]`,
      `input[id*="${isFrom ? 'origin' : 'destination'}"]`,
      `input[id*="${isFrom ? 'from' : 'to'}"]`
    ];
    
    let input = null;
    for (const sel of selectors) {
      input = document.querySelector(sel);
      if (input && input.offsetParent !== null) break; // Ensure it's visible
    }

    // Fallback: search by label text if still not found
    if (!input) {
      const allLabels = Array.from(document.querySelectorAll('label'));
      const targetLabel = allLabels.find(l => l.textContent.toLowerCase().includes(labelPart.toLowerCase()));
      if (targetLabel) {
        input = targetLabel.parentElement.querySelector('input');
      }
    }

    if (!input || !value) {
      console.warn(`RailAssist: Could not find ${labelPart} input`);
      return;
    }

    console.log(`RailAssist: Filling ${labelPart} with ${value}`);
    input.focus();
    input.click();
    
    // Clear and trigger Angular detection
    input.value = '';
    trigger(input, 'input');
    await wait(100);
    
    input.value = value;
    trigger(input, 'input');
    trigger(input, 'keydown');
    
    // Wait longer for autocomplete to populate
    const option = await waitForSelector('li.ui-autocomplete-list-item', 2000);
    if (option) {
      option.click();
      console.log(`RailAssist: Clicked autocomplete for ${value}`);
    } else {
      // Last resort: press enter to trigger autocomplete
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      console.log(`RailAssist: No autocomplete found for ${value}, sent Enter`);
    }
  };

  const selectDropdownOption = async (containerSelector, targetValue, retries = 3) => {
    // containerSelector could be a single selector or an array
    const selectors = Array.isArray(containerSelector) ? containerSelector : [containerSelector];
    
    for (let i = 0; i < retries; i++) {
      let container = null;
      for (const sel of selectors) {
        container = document.querySelector(sel);
        if (container) break;
      }

      if (!container) {
        await wait(200);
        continue;
      }

      const triggerBtn = container.querySelector('.ui-dropdown-trigger') || container;
      triggerBtn.click();
      
      await wait(500);
      
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
        console.log(`RailAssist: Successfully selected ${targetValue}`);
        return true;
      }
      
      document.body.click(); 
      await wait(300);
    }
    return false;
  };

  // 1. Stations
  await selectStation('From station', from);
  await wait(400); 
  await selectStation('To station', to);

  // 2. Date (Robust Calendar Interaction)
  const selectCalendarDate = async (targetDate) => {
    if (!targetDate) return;
    const [tYear, tMonth, tDay] = targetDate.split('-').map(Number);
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const targetMonthName = monthNames[tMonth - 1];

    // Try both homepage and results page date input selectors
    const dateInputSelectors = ['p-calendar[formcontrolname="journeyDate"] input', 'p-calendar input'];
    let input = null;
    for (const sel of dateInputSelectors) {
      input = document.querySelector(sel);
      if (input) break;
    }

    if (!input) return;

    input.click();
    await wait(500);

    let popup = document.querySelector('.ui-datepicker');
    if (!popup) return;

    let attempts = 0;
    while (attempts < 12) {
      const currentMonthEl = popup.querySelector('.ui-datepicker-month');
      const currentYearEl = popup.querySelector('.ui-datepicker-year');
      const currentMonth = currentMonthEl?.textContent?.trim();
      const currentYear = parseInt(currentYearEl?.textContent?.trim() || "0");

      if (currentMonth === targetMonthName && currentYear === tYear) break;

      const isFuture = tYear > currentYear || (tYear === currentYear && (monthNames.indexOf(targetMonthName) > monthNames.indexOf(currentMonth)));
      const navBtn = popup.querySelector(isFuture ? '.ui-datepicker-next' : '.ui-datepicker-prev');
      if (!navBtn) break;
      navBtn.click();
      await wait(300);
      attempts++;
    }

    const days = Array.from(popup.querySelectorAll('td a.ui-state-default, td span.ui-state-default'));
    const dayEl = days.find(el => el.textContent.trim() === String(tDay) && !el.parentElement.classList.contains('ui-datepicker-other-month'));
    
    if (dayEl) {
      dayEl.click();
    } else {
      input.value = `${String(tDay).padStart(2, '0')}/${String(tMonth).padStart(2, '0')}/${tYear}`;
      trigger(input, 'input');
    }
  };

  await selectCalendarDate(date);

  // 3. Class
  await wait(300);
  await selectDropdownOption(['p-dropdown[formcontrolname="journeyClass"]', 'p-dropdown[formcontrolname="class"]'], trainClass);

  // 4. Quota
  await wait(400);
  await selectDropdownOption(['p-dropdown[formcontrolname="journeyQuota"]', 'p-dropdown[formcontrolname="quota"]'], quota);

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

export const clearHighlights = () => {
  const cards = document.querySelectorAll(".form-group.no-pad.col-xs-12.bull-back.border-all");
  cards.forEach(card => {
    card.style.border = "";
    card.style.boxShadow = "";
    card.style.backgroundColor = "";
    const label = card.querySelector('.ra-highlight-label');
    if (label) label.remove();
  });
};

let hasScrolled = false;
export const resetScrollFlag = () => { hasScrolled = false; };

export const findAndHighlightTrain = async (trainNumber) => {
  if (!trainNumber || hasScrolled) return;

  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  // 1. WAIT FOR TRAIN LIST
  let attempts = 0;
  let cards = [];
  const selector = ".form-group.no-pad.col-xs-12.bull-back.border-all";
  
  while (attempts < 25) {
    cards = Array.from(document.querySelectorAll(selector));
    if (cards.length > 0) break;
    await wait(500);
    attempts++;
  }

  if (cards.length === 0) return;

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
    hasScrolled = true;
    console.log(`RailAssist: Auto-scrolling to train ${trainNumber}`);

    const performScroll = () => {
      const rect = targetCard.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const targetY = rect.top + scrollTop - (window.innerHeight / 2) + (rect.height / 2);

      window.scrollTo({
        top: targetY,
        behavior: "auto"
      });
    };

    // First scroll → immediate
    performScroll();

    // 6. SECOND SCROLL (Override IRCTC re-render)
    await wait(100);
    performScroll();
    
    // 7. HIGHLIGHT MATCHED TRAIN
    clearHighlights();
    targetCard.style.border = "3px solid #ff6600";
    targetCard.style.boxShadow = "0 0 20px rgba(255,102,0,0.6)";
    targetCard.style.backgroundColor = "rgba(255, 102, 0, 0.08)";
    
    if (!targetCard.querySelector('.ra-highlight-label')) {
      const label = document.createElement('div');
      label.className = 'ra-highlight-label';
      label.textContent = 'SELECTED TRAIN';
      label.style.cssText = `
        position: absolute; top: -14px; left: 20px;
        background: #ff6600; color: white;
        padding: 2px 12px; border-radius: 6px;
        font-size: 11px; font-weight: bold; z-index: 10;
      `;
      targetCard.style.position = 'relative';
      targetCard.appendChild(label);
    }
  }
};

export const fillPassenger = async (passenger, index) => {
  if (!passenger) return;
  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  const trigger = (el, type) => el.dispatchEvent(new Event(type, { bubbles: true }));

  console.log(`RailAssist: Starting fill for passenger ${index + 1}`, passenger);

  const getNameInputs = () => Array.from(document.querySelectorAll('p-autocomplete[formcontrolname="passengerName"] input, input[formcontrolname="passengerName"], input[placeholder="Name"]'));

  // 1. Ensure the row exists by checking the number of Name inputs
  let nameInputs = getNameInputs();
  let attempts = 0;
  
  while (nameInputs.length <= index && attempts < 5) {
    const addBtn = Array.from(document.querySelectorAll('a, span')).find(el => el.textContent.includes('Add Passenger'));
    if (!addBtn) {
      console.warn(`RailAssist: Cannot find Add Passenger button to add row ${index + 1}`);
      break;
    }
    console.log(`RailAssist: Clicking Add Passenger...`);
    addBtn.click();
    await wait(300);
    nameInputs = getNameInputs();
    attempts++;
  }

  if (nameInputs.length <= index) {
    console.error(`RailAssist: Row for passenger ${index + 1} could not be created/found!`);
    return;
  }

  // Helper to get the correct input for this specific passenger index
  const getField = (selector) => {
    const fields = document.querySelectorAll(selector);
    return fields[index];
  };

  // 2. Fill Name
  const nameInput = nameInputs[index];
  if (nameInput && passenger.name) {
    nameInput.focus();
    nameInput.value = '';
    trigger(nameInput, 'input');
    await wait(50);
    nameInput.value = passenger.name;
    trigger(nameInput, 'input');
    trigger(nameInput, 'change');
    nameInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    nameInput.blur();
    console.log(`RailAssist: Filled name: ${passenger.name}`);
    await wait(100);
  } else {
    console.warn(`RailAssist: Name input not found for pass ${index + 1}`);
  }

  // 3. Fill Age
  const ageInput = getField('input[formcontrolname="passengerAge"], input[placeholder="Age"]');
  if (ageInput && passenger.age) {
    ageInput.focus();
    ageInput.value = passenger.age;
    trigger(ageInput, 'input');
    trigger(ageInput, 'change');
    ageInput.blur();
    console.log(`RailAssist: Filled age: ${passenger.age}`);
  } else {
    console.warn(`RailAssist: Age input not found for pass ${index + 1}`);
  }

  // 4. Fill Gender
  const genderSelect = getField('select[formcontrolname="passengerGender"]');
  if (genderSelect && passenger.gender) {
    const genderMap = { 'Male': 'M', 'Female': 'F', 'Transgender': 'T' };
    genderSelect.focus();
    genderSelect.value = genderMap[passenger.gender] || passenger.gender;
    trigger(genderSelect, 'change');
    genderSelect.blur();
    console.log(`RailAssist: Filled gender: ${genderSelect.value}`);
  } else {
    console.warn(`RailAssist: Gender select not found for pass ${index + 1}`);
  }

  // 5. Fill Berth Preference
  const berthSelect = getField('select[formcontrolname="passengerBerthChoice"]');
  if (berthSelect && passenger.berth) {
    const berthMap = {
      'No Pref': '', 'Lower': 'LB', 'Middle': 'MB', 'Upper': 'UB', 
      'Side Lower': 'SL', 'Side Upper': 'SU'
    };
    berthSelect.focus();
    berthSelect.value = berthMap[passenger.berth] || '';
    trigger(berthSelect, 'change');
    berthSelect.blur();
    console.log(`RailAssist: Filled berth: ${berthSelect.value}`);
  }

  // 6. Fill Food Choice
  const foodSelect = getField('select[formcontrolname="passengerFoodChoice"]');
  if (foodSelect && passenger.food) {
    const foodMap = { 'Veg': 'V', 'Non Veg': 'N', 'Jain': 'J', 'None': 'D' };
    foodSelect.focus();
    foodSelect.value = foodMap[passenger.food] || 'D';
    trigger(foodSelect, 'change');
    foodSelect.blur();
    console.log(`RailAssist: Filled food: ${foodSelect.value}`);
  }

  console.log(`RailAssist: Completed passenger ${index + 1}`);
};

export const fillAllPassengers = async (passengers) => {
  if (!passengers || !Array.isArray(passengers)) return;
  
  // Fill them sequentially to avoid race conditions with "Add Passenger"
  for (let i = 0; i < passengers.length; i++) {
    await fillPassenger(passengers[i], i);
  }
  console.log('RailAssist: Bulk passenger fill complete');
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
