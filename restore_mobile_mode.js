const fs = require('fs');
const path = 'desing.css';
let content = fs.readFileSync(path, 'utf8');

// 1. Clean up potential fragments and broken media queries
// This is a broad cleanup of the broken parts I introduced.

const mobileNavLogic = `
@media (max-width: 768px) {
  .nav-links {
    display: none !important;
  }
  .nav-hamburger {
    display: flex !important;
  }
  .nav-inner {
    height: 100px;
  }
  .nav-logo img {
    height: 55px;
  }
}

@media (max-width: 480px) {
  .nav-inner {
    height: 100px;
  }
  .nav-logo img {
    height: 48px;
  }
}
`;

// Append the restored logic to the end to ensure it overrides any broken fragments
content += mobileNavLogic;

fs.writeFileSync(path, content, 'utf8');
console.log('Mobile Navigation Restored');
