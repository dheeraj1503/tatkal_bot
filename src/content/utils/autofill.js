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

    // Wait for dropdown
    const option = await waitForSelector('li.ui-autocomplete-list-item', 1500);
    if (option) {
      option.click();
      console.log(`RailAssist: Selected ${labelPart} ${value}`);
    }
  };

  // 1. Stations (Parallelish start)
  selectStation('From station', from);
  await wait(400); // Small gap before starting 'To'
  await selectStation('To station', to);

  // 2. Date
  const dateInput = document.querySelector('p-calendar input');
  if (dateInput && date) {
    const [y, m, d] = date.split('-');
    const formattedDate = `${d}/${m}/${y}`;
    dateInput.value = formattedDate;
    trigger(dateInput, 'input');
    trigger(dateInput, 'change');
    // Close calendar
    dateInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
  }

  // 3. Class Dropdown
  const classDropdown = document.querySelector('p-dropdown[formcontrolname="journeyClass"] .ui-dropdown-trigger');
  if (classDropdown && trainClass) {
    classDropdown.click();
    const target = await waitForSelector('li.ui-dropdown-item', 1000);
    if (target) {
      const allOptions = Array.from(document.querySelectorAll('li.ui-dropdown-item'));
      const match = allOptions.find(opt => opt.textContent.includes(trainClass));
      if (match) match.click();
    }
  }

  // 4. Quota Dropdown
  await wait(200);
  const quotaDropdown = document.querySelector('p-dropdown[formcontrolname="quota"] .ui-dropdown-trigger');
  if (quotaDropdown && quota) {
    quotaDropdown.click();
    const target = await waitForSelector('li.ui-dropdown-item', 1000);
    if (target) {
      const allOptions = Array.from(document.querySelectorAll('li.ui-dropdown-item'));
      const match = allOptions.find(opt => 
        opt.textContent.toUpperCase().includes(quota.toUpperCase()) ||
        opt.getAttribute('aria-label')?.toUpperCase().includes(quota.toUpperCase())
      );
      if (match) match.click();
    }
  }

  console.log('RailAssist: Journey fill fast sequence complete');
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
