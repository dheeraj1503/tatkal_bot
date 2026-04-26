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
