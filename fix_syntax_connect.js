const fs = require('fs');
const path = 'connect.js';
let content = fs.readFileSync(path, 'utf8');

// Fix the corrupted refreshUserUI function and remove the trailing garbage
const corruptedSegment = /function refreshUserUI\(\) \{[\s\S]*?refreshUserUI\(\);[\s\S]*?\}/;
// Actually, I'll just find the exact garbage I introduced.

// Looking at the subagent's report, it's around refreshUserUI.
// Let's do a more precise replacement.

content = content.replace(/function refreshUserUI\(\) \{[\s\S]*?\}\s+👋\`;\s+greeting\.classList\.remove\('hidden'\);\s+\}/, 
`function refreshUserUI() {
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
console.log('connect.js Syntax Fixed');
