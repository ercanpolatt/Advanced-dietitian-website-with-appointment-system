const fs = require('fs');
const path = 'desing.css';
let content = fs.readFileSync(path, 'utf8');

// 1. Remove transparency/blur from navbar
content = content.replace(/background: transparent;/, 'background: #ffffff !important;');
content = content.replace(/background: var\(--white\);/g, 'background: #ffffff !important;');
content = content.replace(/backdrop-filter: blur\(20px\);/g, '');
content = content.replace(/-webkit-backdrop-filter: blur\(20px\);/g, '');

// 2. Mobile Menu slide from RIGHT
content = content.replace(/transform: translateX\(-100%\);/, 'transform: translateX(100%);');
// Note: translateX(0) stays the same for opening.

// 3. Ensure full screen mobile menu
content = content.replace(/\.mobile-menu \{[\s\S]*?z-index: 1100;/, `.mobile-menu {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: white;
  z-index: 2000;`);

fs.writeFileSync(path, content, 'utf8');
console.log('Header Solid and Menu Side Switched');
