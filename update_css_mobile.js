const fs = require('fs');
const path = 'desing.css';
let content = fs.readFileSync(path, 'utf8');

// Add mobile-menu-cta styles and hide nav-cta on mobile
const mobileStyles = `
/* Mobile Menu CTA (User Section) */
.mobile-menu-cta {
  margin-top: auto;
  padding: 2rem;
  border-top: 1px solid rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: var(--cream);
}

.mobile-menu-cta .user-greeting {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--cherry);
  margin-bottom: 0.5rem;
}

.mobile-menu-cta .btn-pill,
.mobile-menu-cta .btn-outline {
  width: 100%;
  justify-content: center;
}

@media (max-width: 768px) {
  .nav-cta {
    display: none !important;
  }
}
`;

content += mobileStyles;

fs.writeFileSync(path, content, 'utf8');
console.log('desing.css Updated');
