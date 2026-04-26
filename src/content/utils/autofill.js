export const fillJourney = (journey) => {
  const { from, to, date, trainClass, quota } = journey;

  // Helper to trigger events
  const trigger = (el, type) => {
    el.dispatchEvent(new Event(type, { bubbles: true }));
  };

  // 1. Fill From/To Station (AutoComplete)
  const fillStation = async (selector, value) => {
    const input = document.querySelector(selector);
    if (!input || !value) return;

    input.value = value;
    trigger(input, 'input');
    trigger(input, 'focus');

    // Wait for dropdown and click first option
    setTimeout(() => {
      const options = document.querySelectorAll('.ui-autocomplete-list-item, .ui-state-highlight');
      if (options.length > 0) {
        options[0].click();
      }
    }, 500);
  };

  fillStation('p-autocomplete[formcontrolname="fromStation"] input', from);
  setTimeout(() => fillStation('p-autocomplete[formcontrolname="toStation"] input', to), 600);

  // 2. Fill Date
  const dateInput = document.querySelector('p-calendar[formcontrolname="journeyDate"] input');
  if (dateInput && date) {
    // IRCTC date format is DD-MM-YYYY
    const [y, m, d] = date.split('-');
    const formattedDate = `${d}-${m}-${y}`;
    dateInput.value = formattedDate;
    trigger(dateInput, 'input');
  }

  // 3. Fill Class
  const classDropdown = document.querySelector('p-dropdown[formcontrolname="journeyClass"]');
  if (classDropdown && trainClass) {
    classDropdown.click();
    setTimeout(() => {
      const classOptions = Array.from(document.querySelectorAll('.ui-dropdown-item'));
      const target = classOptions.find(opt => opt.textContent.includes(trainClass));
      if (target) target.click();
    }, 300);
  }

  // 4. Fill Quota
  const quotaDropdown = document.querySelector('p-dropdown[formcontrolname="quota"]');
  if (quotaDropdown && quota) {
    quotaDropdown.click();
    setTimeout(() => {
      const quotaOptions = Array.from(document.querySelectorAll('.ui-dropdown-item'));
      const target = quotaOptions.find(opt => opt.textContent.toUpperCase().includes(quota.toUpperCase()));
      if (target) target.click();
    }, 600);
  }

  console.log('RailAssist: Filled journey details');
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
