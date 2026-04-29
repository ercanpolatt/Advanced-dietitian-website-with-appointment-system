const fs = require('fs');
const path = 'connect.js';
let content = fs.readFileSync(path, 'utf8');

// Update logout function
content = content.replace(/function logout\(\) \{([\s\S]*?)\}/, `function logout() {
  APP.currentUser = null;
  localStorage.removeItem(APP.STORAGE_KEYS.USER);

  document.querySelectorAll('.login-btn').forEach(btn => btn.classList.remove('hidden'));
  document.querySelectorAll('.logout-btn').forEach(btn => btn.classList.add('hidden'));
  document.querySelectorAll('.user-greeting').forEach(el => el.classList.add('hidden'));

  showToast('Çıkış yapıldı.', 'info');
  showSection('ana-sayfa');
}`);

// Update refreshUserUI function
content = content.replace(/function refreshUserUI\(\) \{([\s\S]*?)\}/, `function refreshUserUI() {
  if (!APP.currentUser) return;
  
  document.querySelectorAll('.login-btn').forEach(btn => btn.classList.add('hidden'));
  document.querySelectorAll('.logout-btn').forEach(btn => btn.classList.remove('hidden'));

  const firstName = APP.currentUser.name.split(' ')[0];
  document.querySelectorAll('.user-greeting').forEach(el => {
    el.textContent = \`Merhaba, \${firstName} 👋\`;
    el.classList.remove('hidden');
  });
}`);

fs.writeFileSync(path, content, 'utf8');
console.log('connect.js Updated');
