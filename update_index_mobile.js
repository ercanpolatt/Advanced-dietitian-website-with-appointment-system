const fs = require('fs');
const path = 'index.html';
let content = fs.readFileSync(path, 'utf8');

// 1. Update header elements with classes for easy targeting
content = content.replace(
    /id="userGreeting" class="hidden"/,
    'id="userGreeting" class="user-greeting hidden"'
);
content = content.replace(
    /id="logoutBtn" onclick="logout\(\)"/,
    'id="logoutBtn" class="logout-btn hidden" onclick="logout()"'
);
content = content.replace(
    /id="loginBtn" onclick="showModal\('loginModal'\)"/,
    'id="loginBtn" class="login-btn" onclick="showModal(\'loginModal\')"'
);

// 2. Add mobile menu footer
const mobileMenuEnd = /<\/ul>\s+<\/div>/;
const mobileMenuCTA = `</ul>
      <div class="mobile-menu-cta">
        <div class="user-greeting hidden"></div>
        <button class="btn-outline logout-btn hidden" onclick="logout()">Çıkış Yap</button>
        <button class="btn-pill login-btn" onclick="showModal('loginModal')">Giriş Yap</button>
      </div>
    </div>`;

content = content.replace(mobileMenuEnd, mobileMenuCTA);

fs.writeFileSync(path, content, 'utf8');
console.log('index.html Updated');
