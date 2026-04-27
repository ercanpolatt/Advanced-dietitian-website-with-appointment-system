/**
 * YaSem Diyet – Beslenme & Diyet Danışmanlığı
 * Main JavaScript – Refactored & Improved
 * @author YaSem Team
 */

/* ═══════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════ */
const BMI_THRESHOLDS = { UNDERWEIGHT: 18.5, NORMAL: 25, OVERWEIGHT: 30 };
const HEIGHT_LIMITS = { MIN: 50, MAX: 300 };
const WEIGHT_LIMITS = { MIN: 10, MAX: 500 };
const TOAST_DURATION_MS = 4000;
const PHONE_REGEX = /^[0-9\-\+\s\(\)]{10,}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Sabah + Öleden Sonra, 30 dakika aralıklı
const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30'
];

/* ═══════════════════════════════════════════
   APPLICATION STATE
═══════════════════════════════════════════ */
const APP = {
  currentUser: null,
  appointments: [],
  STORAGE_KEYS: {
    USER: 'yasem_user',
    APPOINTMENTS: 'yasem_appointments'
  }
};

/* ═══════════════════════════════════════════
   INITIALIZATION
═══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
  setupEventListeners();
  loadUserSession();
});

function initializeApp() {
  const today = new Date().toISOString().split('T')[0];
  const dateInput = document.getElementById('appointmentDate');
  if (dateInput) dateInput.setAttribute('min', today);

  // Galeriyi otomatik doldur (20 ekstra reels mock up)
  generateExtraReels();
}

function setupEventListeners() {
  // Navbar scroll
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });

  // Modal backdrop click
  document.querySelectorAll('.modal-overlay').forEach((overlay) => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal(overlay.id);
    });
  });

  // ESC key closes modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach((m) => {
        closeModal(m.id);
      });
    }
  });

  // Scroll-to-top button
  const scrollBtn = document.getElementById('scrollTopBtn');
  if (scrollBtn) {
    window.addEventListener('scroll', () => {
      scrollBtn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* ═══════════════════════════════════════════
   NAVBAR & SCROLL
═══════════════════════════════════════════ */
function handleNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 20);
}

/* ═══════════════════════════════════════════
   SECTION NAVIGATION
═══════════════════════════════════════════ */
function showSection(sectionId) {
  document.querySelectorAll('section').forEach((s) => s.classList.remove('active'));
  const target = document.getElementById(sectionId);
  if (target) target.classList.add('active');

  window.scrollTo({ top: 0, behavior: 'smooth' });
  updateActiveNavLink(sectionId);

  if (sectionId === 'randevu') refreshAppointmentSection();
}

function updateActiveNavLink(sectionId) {
  document.querySelectorAll('.nav-links a').forEach((link) => {
    link.classList.remove('active');
    if (link.getAttribute('onclick')?.includes(sectionId)) {
      link.classList.add('active');
    }
  });
}

function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const backdrop = document.getElementById('mobileMenuBackdrop');
  const hamburger = document.getElementById('navHamburger');
  if (menu && hamburger) {
    menu.classList.toggle('open');
    if (backdrop) backdrop.classList.toggle('open');
    hamburger.classList.toggle('active');

    // Prevent background scrolling when menu is open
    document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
  }
}

/* ═══════════════════════════════════════════
   GALLERY / CAROUSEL
═══════════════════════════════════════════ */
function toggleReelText(btn) {
  const textContainer = btn.previousElementSibling;
  if (textContainer && textContainer.classList.contains('reel-text')) {
    textContainer.classList.toggle('expanded');
    if (textContainer.classList.contains('expanded')) {
      btn.textContent = 'Daha Az Göster';
    } else {
      btn.textContent = 'Devamını Oku';
    }
  }
}

function generateExtraReels() {
  const container = document.getElementById('reelsContainer');
  if (!container) return;

  const names = ['Ahmet Y.', 'Elif B.', 'Caner T.', 'Selin M.', 'Burcu K.', 'Oğuzhan D.', 'Gökçe S.', 'Emre C.', 'Deniz A.', 'Kerem V.', 'Merve N.', 'Pınar E.', 'Volkan R.', 'Aslı P.', 'Cem G.', 'Derya L.', 'Hakan F.', 'İrem H.', 'Tolga Z.', 'Sinem C.'];
  const results = [
    '14 kg verdi • 4 ay', '8 kg verdi • 2 ay', '22 kg verdi • 6 ay', '11 kg verdi • 3 ay', '9 kg aldı • 3 ay',
    '16 kg verdi • 5 ay', '10 kg verdi • 3 ay', '18 kg verdi • 6 ay', '13 kg verdi • 4 ay', '15 kg verdi • 4 ay',
    '7 kg verdi • 2 ay', '19 kg verdi • 5 ay', '12 kg verdi • 3 ay', '8 kg aldı • 4 ay', '21 kg verdi • 7 ay',
    '9 kg verdi • 2 ay', '17 kg verdi • 5 ay', '10 kg aldı • 4 ay', '14 kg verdi • 4 ay', '25 kg verdi • 8 ay'
  ];
  const quotes = [
    'Düzenli beslenerek hayatım değişti. Enerjim tavan yaptı!',
    'Tatlı krizlerini aştım. Artık çok daha sağlıklıyım.',
    'Yıllardır veremediğim kiloları YaSem Diyet ile verdim.',
    'Hem inceldim hem de daha fit hissediyorum.',
    'Kilo almak benim için hayaldi, şimdi ideal kilomdayım.',
    'EMS antrenmanları ile bölgesel yağlarımdan kurtuldum.',
    'Sadece zayıflamakla kalmadım, doğru beslenmeyi öğrendim.',
    'Pes etmek üzereyken harika destek oldular.',
    'Online diyetin bu kadar etkili olacağını düşünmezdim.',
    'Aç kalmadan kilo vermenin keyfini yaşıyorum.',
    'Kısa sürede büyük değişim. Çok teşekkür ederim.',
    'Sağlık sorunlarım geride kaldı. Kendimi yenilenmiş hissediyorum.',
    'Güleryüzlü ve profesyonel yaklaşım için minnettarım.',
    'Kilo almak da vermek kadar zormuş. Ama başardık!',
    'Büyük bir dönüşüm yaşadım. Özgüvenim yerine geldi.',
    'Diyet yapmak hiç bu kadar keyifli olmamıştı.',
    'Hedefime ulaşmamda en büyük destekçim YaSem Diyet.',
    'Kas kütlemi artırarak sağlıklı bir şekilde kilo aldım.',
    'Motivasyonumu hiç düşürmediler. Her adımda yanımdaydılar.',
    'İmkansız diye bir şey yokmuş. Sonuçlar inanılmaz!'
  ];

  for (let i = 0; i < 20; i++) {
    const card = document.createElement('div');
    card.className = 'reel-card';

    // Yüksek kaliteli spor/fitness placeholder fotoğrafları
    const imageUrl = `https://picsum.photos/seed/diyet${i + 10}/600/1000`;

    card.innerHTML = `
      <img src="${imageUrl}" alt="Başarı Hikayesi" class="reel-image" loading="lazy">
      <div class="reel-overlay">
        <div class="reel-info">
          <div class="reel-header">
            <h3 class="reel-name">${names[i]}</h3>
            <span class="reel-badge">✨ ${results[i]}</span>
          </div>
          <div class="reel-text-container">
            <p class="reel-text">"${quotes[i]}"</p>
            <button class="reel-read-more" onclick="toggleReelText(this)">Devamını Oku</button>
          </div>
        </div>
      </div>
    `;
    container.appendChild(card);
  }
}

/* ═══════════════════════════════════════════
   BMI CALCULATOR
═══════════════════════════════════════════ */
function calculateBMI() {
  const height = parseFloat(document.getElementById('height').value);
  const weight = parseFloat(document.getElementById('weight').value);

  if (!height || !weight ||
    height < HEIGHT_LIMITS.MIN || height > HEIGHT_LIMITS.MAX ||
    weight < WEIGHT_LIMITS.MIN || weight > WEIGHT_LIMITS.MAX) {
    showToast(`Lütfen geçerli boy (${HEIGHT_LIMITS.MIN}-${HEIGHT_LIMITS.MAX} cm) ve kilo (${WEIGHT_LIMITS.MIN}-${WEIGHT_LIMITS.MAX} kg) değerleri girin.`, 'warning');
    return;
  }

  const bmi = (weight / Math.pow(height / 100, 2)).toFixed(1);
  let category, advice;

  if (bmi < BMI_THRESHOLDS.UNDERWEIGHT) {
    category = 'Zayıf';
    advice = 'Sağlıklı kilo almanız için profesyonel destek almanızı öneririz.';
  } else if (bmi < BMI_THRESHOLDS.NORMAL) {
    category = 'Normal ✅';
    advice = 'Harika! Sağlıklı bir kiloya sahipsiniz. Dengeli beslenmeye devam edin.';
  } else if (bmi < BMI_THRESHOLDS.OVERWEIGHT) {
    category = 'Fazla Kilolu';
    advice = 'Sağlıklı kilo vermeniz için kişiye özel bir beslenme programı oluşturabiliriz.';
  } else {
    category = 'Obez';
    advice = 'Sağlığınız için profesyonel destek almanız çok önemli. Hemen randevu alın.';
  }

  document.getElementById('bmiValue').textContent = bmi;
  document.getElementById('bmiCategory').textContent = category;
  document.getElementById('bmiAdvice').textContent = advice;
  document.getElementById('bmiResult').classList.add('show');
}

/* ═══════════════════════════════════════════
   AUTHENTICATION
═══════════════════════════════════════════ */
function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('open');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('open');
}

function login() {
  const name = document.getElementById('loginName').value.trim();
  const phone = document.getElementById('loginPhone').value.trim();
  const email = document.getElementById('loginEmail').value.trim();

  if (!name || !phone || !email) {
    showToast('Lütfen tüm alanları doldurun.', 'warning');
    return;
  }

  if (!EMAIL_REGEX.test(email)) {
    showToast('Lütfen geçerli bir e-posta adresi girin.', 'warning');
    return;
  }

  if (!PHONE_REGEX.test(phone)) {
    showToast('Lütfen geçerli bir telefon numarası girin (en az 10 hane).', 'warning');
    return;
  }

  APP.currentUser = { name, phone, email, loginTime: new Date().toISOString() };

  try {
    localStorage.setItem(APP.STORAGE_KEYS.USER, JSON.stringify(APP.currentUser));
  } catch (err) {
    console.error('Oturum kaydedilemedi:', err);
  }

  refreshUserUI();
  closeModal('loginModal');
  showSection('randevu');
  showToast(`Hoşgeldiniz, ${name}! Randevu almaya hazırsınız.`, 'success');
}

function logout() {
  APP.currentUser = null;
  localStorage.removeItem(APP.STORAGE_KEYS.USER);

  document.getElementById('loginBtn').classList.remove('hidden');
  document.getElementById('logoutBtn').classList.add('hidden');
  document.getElementById('userGreeting').classList.add('hidden');

  showToast('Çıkış yapıldı.', 'info');
  showSection('ana-sayfa');
}

function refreshUserUI() {
  if (!APP.currentUser) return;
  document.getElementById('loginBtn').classList.add('hidden');
  document.getElementById('logoutBtn').classList.remove('hidden');

  const greeting = document.getElementById('userGreeting');
  const firstName = APP.currentUser.name.split(' ')[0];
  greeting.textContent = `Merhaba, ${firstName} 👋`;
  greeting.classList.remove('hidden');
}

function loadUserSession() {
  try {
    const storedUser = localStorage.getItem(APP.STORAGE_KEYS.USER);
    if (storedUser) {
      APP.currentUser = JSON.parse(storedUser);
      refreshUserUI();
    }
    const storedAppts = localStorage.getItem(APP.STORAGE_KEYS.APPOINTMENTS);
    if (storedAppts) APP.appointments = JSON.parse(storedAppts);
  } catch (error) {
    console.error('Oturum yüklenemedi:', error);
  }
}

/* ═══════════════════════════════════════════
   APPOINTMENT MANAGEMENT
═══════════════════════════════════════════ */
function updateOfficeInfo() {
  const officeSelect = document.getElementById('office');
  const emsInfo = document.getElementById('emsInfo');
  if (officeSelect && emsInfo) {
    emsInfo.classList.toggle('hidden', officeSelect.value !== 'karacabey');
  }
}

function refreshAppointmentSection() {
  const hasUser = !!APP.currentUser;
  const loginReq = document.getElementById('loginRequired');
  const form = document.getElementById('appointmentForm');
  const myAppts = document.getElementById('myAppointments');

  if (loginReq) loginReq.classList.toggle('hidden', hasUser);
  if (form) form.classList.toggle('hidden', !hasUser);
  if (myAppts) myAppts.classList.toggle('hidden', !hasUser);
  if (hasUser) {
    renderAppointments();
    renderTimeSlots(); // refresh slot availability
  }
}

function submitAppointment(event) {
  event.preventDefault();

  const office = document.getElementById('office').value;
  const date = document.getElementById('appointmentDate').value;
  const time = document.getElementById('appointmentTime').value;
  const service = document.getElementById('serviceType').value;
  const notes = document.getElementById('notes').value;

  if (!office || !date || !time || !service) {
    showToast('Lütfen zorunlu alanları doldurun.', 'warning');
    return;
  }

  // Geçmiş tarih kontrolü
  const today = new Date().toISOString().split('T')[0];
  if (date < today) {
    showToast('Geçmiş bir tarihe randevu oluşturamazsınız.', 'warning');
    return;
  }

  // Çakışma kontrolü
  const conflict = APP.appointments.some(
    (a) => a.office === office && a.date === date && a.time === time
  );
  if (conflict) {
    showToast('Bu saat ve tarihte bu ofiste randevu dolu. Lütfen başka bir zaman seçin.', 'warning');
    return;
  }

  // Loading state
  const submitBtn = document.getElementById('submitApptBtn');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span> Oluşturuluyor...';
  }

  setTimeout(() => {
    const appointment = {
      id: Date.now(),
      userName: APP.currentUser.name,
      userPhone: APP.currentUser.phone,
      userEmail: APP.currentUser.email,
      office, date, time, service, notes,
      createdAt: new Date().toISOString(),
      status: 'confirmed'
    };

    APP.appointments.push(appointment);

    try {
      localStorage.setItem(APP.STORAGE_KEYS.APPOINTMENTS, JSON.stringify(APP.appointments));
    } catch (err) {
      console.error('Randevu kaydedilemedi:', err);
    }

    showToast('Randevunuz başarıyla oluşturuldu! Telefon numaranızdan teyit aranacaktır.', 'success');
    event.target.reset();
    document.getElementById('emsInfo').classList.add('hidden');
    // Slot grid'i sıfırla
    const grid = document.getElementById('timeSlotsGrid');
    if (grid) {
      grid.innerHTML = '<p class="slots-placeholder">Önce ofis ve tarih seçin</p>';
    }
    document.getElementById('appointmentTime').value = '';
    renderAppointments();
    renderTimeSlots();

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Randevu Oluştur →';
    }
  }, 800);
}

/* ═══════════════════════════════════════════
   TIME SLOT PICKER
═══════════════════════════════════════════ */

/**
 * Verilen ofis+tarih kombinasyonuna göre dolu saatleri döndürür.
 * Tüm kullanıcıların randevuları baz alınır.
 */
function getTakenSlots(office, date) {
  return APP.appointments
    .filter((a) => a.office === office && a.date === date)
    .map((a) => a.time);
}

/**
 * Saat kartlarını oluşturur ve dolu/müsait/seçili gösterir.
 */
function renderTimeSlots() {
  const grid = document.getElementById('timeSlotsGrid');
  const hiddenInput = document.getElementById('appointmentTime');
  if (!grid) return;

  const office = document.getElementById('office')?.value;
  const date = document.getElementById('appointmentDate')?.value;

  if (!office || !date) {
    grid.innerHTML = '<p class="slots-placeholder">Önce ofis ve tarih seçin</p>';
    if (hiddenInput) hiddenInput.value = '';
    return;
  }

  const takenSlots = getTakenSlots(office, date);
  const currentSelected = hiddenInput?.value || '';

  // Geçmiş saatleri geçersiz kıl (bugün için)
  const today = new Date().toISOString().split('T')[0];
  const now = new Date();
  const isToday = date === today;

  grid.innerHTML = '';
  TIME_SLOTS.forEach((slot, idx) => {
    const isTaken = takenSlots.includes(slot);
    const isSelected = slot === currentSelected;

    // Bugün için geçmiş saat mi?
    let isPast = false;
    if (isToday) {
      const [h, m] = slot.split(':').map(Number);
      const slotDate = new Date();
      slotDate.setHours(h, m, 0, 0);
      isPast = slotDate < now;
    }

    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'time-slot-card';
    card.textContent = slot;
    card.setAttribute('data-time', slot);
    card.style.animationDelay = `${idx * 35}ms`;

    if (isTaken || isPast) {
      card.classList.add(isPast ? 'slot-past' : 'slot-taken');
      card.disabled = true;
      card.title = isPast ? 'Geçmiş saat' : 'Bu saat dolu';
    } else if (isSelected) {
      card.classList.add('slot-selected');
    } else {
      card.classList.add('slot-available');
    }

    card.addEventListener('click', () => {
      if (card.disabled) return;
      // De-select previous
      grid.querySelectorAll('.time-slot-card').forEach((c) => {
        c.classList.remove('slot-selected');
        if (!c.disabled) c.classList.add('slot-available');
      });
      card.classList.remove('slot-available');
      card.classList.add('slot-selected');
      if (hiddenInput) hiddenInput.value = slot;
    });

    grid.appendChild(card);
  });
}

/** XSS-safe text escaping */
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

const OFFICE_LABELS = {
  karacabey: 'Karacabey',
  bandirma: 'Bandırma',
  susurluk: 'Susurluk'
};

/**
 * Randevunun geçmiş olup olmadığını kontrol eder.
 * Randevu saatinden 1 saat sonrası geçildiyse geçmiş sayılır.
 * Not: YYYY-MM-DD formatı UTC olarak parse edilir, yerel saat için
 * saat/dakika manuel ayarlanır.
 */
function isAppointmentPast(appt) {
  const [year, month, day] = appt.date.split('-').map(Number);
  const [h, m] = appt.time.split(':').map(Number);
  const apptDateTime = new Date(year, month - 1, day, h, m, 0, 0);
  apptDateTime.setHours(apptDateTime.getHours() + 1); // 1 saat geçince geçmiş
  return new Date() > apptDateTime;
}

function renderAppointments() {
  if (!APP.currentUser) return;
  const list = document.getElementById('appointmentsList');
  if (!list) return;

  const userAppts = APP.appointments.filter(
    (a) => a.userName === APP.currentUser.name
  );

  if (userAppts.length === 0) {
    list.innerHTML = '';
    const p = document.createElement('p');
    p.style.cssText = 'font-size:.85rem;color:var(--mid);text-align:center;padding:2rem 0';
    p.textContent = 'Henüz randevunuz bulunmuyor. Yeni randevu oluşturmak için formu doldurun.';
    list.appendChild(p);
    return;
  }

  // Geçmiş ve gelecek olarak ayır
  const upcoming = userAppts.filter((a) => !isAppointmentPast(a));
  const past = userAppts.filter((a) => isAppointmentPast(a));

  list.innerHTML = '';

  const renderApptItem = (appt, isPast) => {
    const officeName = OFFICE_LABELS[appt.office] || appt.office;
    const formattedDate = new Date(appt.date).toLocaleDateString('tr-TR', {
      weekday: 'short', year: 'numeric', month: 'long', day: 'numeric'
    });

    const item = document.createElement('div');
    item.className = isPast ? 'appt-item appt-item-past' : 'appt-item';

    const left = document.createElement('div');
    left.className = 'appt-item-left';

    const loc = document.createElement('div');
    loc.className = 'appt-item-loc';
    loc.textContent = `🏥 ${officeName}`;

    const timeEl = document.createElement('div');
    timeEl.className = 'appt-item-time';
    timeEl.textContent = `${formattedDate} • ${appt.time}`;

    const svc = document.createElement('div');
    svc.className = 'appt-item-service';
    svc.textContent = appt.service;

    left.append(loc, timeEl, svc);
    item.append(left);

    if (!isPast) {
      const cancelBtn = document.createElement('button');
      cancelBtn.className = 'btn-cancel-appt';
      cancelBtn.textContent = 'İptal Et';
      cancelBtn.addEventListener('click', () => showCancelConfirm(appt.id, item));
      item.appendChild(cancelBtn);
    } else {
      const badge = document.createElement('span');
      badge.className = 'appt-past-badge';
      badge.textContent = 'Tamamlandı';
      item.appendChild(badge);
    }

    list.appendChild(item);
  };

  if (upcoming.length > 0) {
    const heading = document.createElement('div');
    heading.className = 'appt-section-title';
    heading.textContent = '⏰ Yaklaşan Randevular';
    list.appendChild(heading);
    upcoming.forEach((a) => renderApptItem(a, false));
  }

  if (past.length > 0) {
    const heading = document.createElement('div');
    heading.className = 'appt-section-title appt-section-past';
    heading.textContent = '✓ Geçmiş Randevular';
    list.appendChild(heading);
    past.forEach((a) => renderApptItem(a, true));
  }
}

/**
 * Satır içi iptal onay UI'si (confirm() yerine - file:// protokolünde güvenli)
 */
function showCancelConfirm(appointmentId, itemEl) {
  // Zaten açık mı?
  if (itemEl.querySelector('.cancel-confirm-row')) return;

  const row = document.createElement('div');
  row.className = 'cancel-confirm-row';

  const msg = document.createElement('span');
  msg.textContent = 'Randevuyu iptal etmek istiyor musunuz?';

  const yesBtn = document.createElement('button');
  yesBtn.className = 'btn-confirm-yes';
  yesBtn.textContent = 'Evet, İptal Et';
  yesBtn.addEventListener('click', () => cancelAppointment(appointmentId));

  const noBtn = document.createElement('button');
  noBtn.className = 'btn-confirm-no';
  noBtn.textContent = 'Vazgeç';
  noBtn.addEventListener('click', () => row.remove());

  row.append(msg, yesBtn, noBtn);
  itemEl.appendChild(row);
}

function cancelAppointment(appointmentId) {
  APP.appointments = APP.appointments.filter((a) => a.id !== appointmentId);
  try {
    localStorage.setItem(APP.STORAGE_KEYS.APPOINTMENTS, JSON.stringify(APP.appointments));
  } catch (err) {
    console.error('Randevu iptal kaydedilemedi:', err);
  }

  showToast('Randevunuz iptal edildi.', 'info');
  renderAppointments();
  renderTimeSlots();
}

/* ═══════════════════════════════════════════
   TOAST NOTIFICATION SYSTEM
═══════════════════════════════════════════ */
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) {
    // Fallback: legacy alert box
    const alertBox = document.getElementById('apptFeedback');
    if (alertBox) {
      alertBox.innerHTML = `<div class="alert-box alert-${type}">${escapeHTML(message)}</div>`;
      setTimeout(() => { alertBox.innerHTML = ''; }, TOAST_DURATION_MS);
    }
    return;
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const icons = { success: '✅', warning: '⚠️', info: 'ℹ️', error: '❌' };
  toast.innerHTML = `<span class="toast-icon">${icons[type] || 'ℹ️'}</span><span class="toast-msg">${escapeHTML(message)}</span>`;

  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));

  setTimeout(() => {
    toast.classList.remove('show');
    toast.addEventListener('transitionend', () => toast.remove());
  }, TOAST_DURATION_MS);
}

// Legacy compatibility
function showAlert(message, type) {
  showToast(message, type);
}

/* ═══════════════════════════════════════════
   BLOG MODAL SYSTEM
═══════════════════════════════════════════ */
const BLOG_ARTICLES = [
  {
    id: 0,
    title: "Dengeli Beslenmenin Önemi",
    emoji: "🍽️",
    fullContent: `Dengeli beslenme, vücudumuzun normal işlevini sürdürmesi için gerekli tüm besin öğelerini doğru oranlarda almak anlamına gelir. Karbonhidratlar, proteinler, yağlar, vitaminler, mineraller ve su gibi besin öğeleri her yaşta sağlığımızı korumak için gereklidir.

Beslenme dengesizliği obezite, diyabet, kalp hastalıkları ve birçok kronik hastalığın temel sebebidir. Bir gün içinde alınan kalori miktarının %50-65'i karbonhidratlardan, %10-35'i proteinlerden, %20-35'i yağlardan gelmesi önerilir.

YaSem Diyet'te, kişinin yaşı, aktivite seviyesi, sağlık durumu ve hedefleri doğrultusunda özel dengelenmiş beslenme programları hazırlıyoruz.

Çoğu zaman insanlar yanlış diyet uygulamalarına başvururlar ve bu kısa süreli sonuçlar verse de uzun vadede vücuda zarar verir. Dengeli beslenme, kalıcı sonuçlar için en etkili yoldur.`
  },
  {
    id: 1,
    title: "Su İçmenin Önemi ve Faydaları",
    emoji: "💧",
    fullContent: `Su, insan vücudunun %60-70'ini oluşturan ve yaşam için vazgeçilmez olan birincil elementtir. Yeterli su tüketimi metabolizmayı hızlandırır, vücuttan toksitleri temizler, cilt sağlığını iyileştirir, enerji seviyesini artırır ve kilo kontrolünü destekler.

Günde en az 8-10 bardak (2-3 litre) su içilmesi önerilir. Ancak su ihtiyacı kişinin yaşı, cinsiyeti, aktivite seviyesi ve iklim koşullarına göre değişebilir.

Yetersiz su tüketimi yorgunluk, baş ağrısı, düşük konsantrasyon, cilt sorunları ve hatta kilo almaya yol açabilir. Su sadece susuzluğu gidermez, aynı zamanda besin emilimini de artırır.

YaSem Diyet danışmanları, su tüketim alışkanlığını da beslenme programının bir parçası olarak değerlendirir ve kişiye özel su tüketim planı oluştururuz.`
  },
  {
    id: 2,
    title: "Kış Mevsimi Meyve ve Sebzeleri",
    emoji: "🎃",
    fullContent: `Kış mevsiminde tüketilen meyve ve sebzeler, doğal mevsim döngüsüne uymuş olduğundan daha lezzetli ve besleyicidir. Portakal, mandalina, limon, greyfurt gibi sitrus meyveler C vitamini açısından zengindir ve bağışıklık sistemini güçlendirir.

Lahana, brokoli, pırasa, havuç, pancar ve karalahana kış sebzeleri arasında yer alır. Bu sebzelerin tümü vitamin, mineral ve antioksidanlar bakımından oldukça zengindir.

Yerel ve mevsimsel ürünler hem daha ucuz hem de daha sağlıklıdır. Kış mevsiminde bu ürünleri bolca tüketmek bağışıklığınızı güçlü hale getirecektir.

Ayrıca bu sebzeler daha az pestisit içerir ve çevre için daha sürdürülebilir seçeneklerdir.`
  },
  {
    id: 3,
    title: "Sağlıklı Yağlar Rehberi",
    emoji: "🥑",
    fullContent: `Yağlar besin zincirinin önemli bir parçasıdır ve tümü zararlı değildir. Avokado, zeytinyağı, balık yağı ve kuruyemişlerdeki yağlar "iyi yağlar" olarak bilinir ve kalp sağlığını korur.

Omega-3 yağ asitleri, beyin sağlığı, anti-inflamasyon ve kalp hastalıklarından koruma sağlar. Çoğu balık, özellikle somon, uskumru omega-3 açısından zengindir.

Bunun aksine hayvan kökenli doymuş yağlar ve trans yağlar zararlıdır. Bu tür yağlar kolesterol seviyesini artırır ve kalp hastalıkları riskini yükseltir.

Günde 25-35 gram yağ alınması önerilir, ancak bu yağlar sağlıklı kaynaklardan gelmelidir.`
  },
  {
    id: 4,
    title: "Spor ve Beslenme İlişkisi",
    emoji: "🏋️",
    fullContent: `Sporcu beslenme, performansı artırmak, kasları geliştirmek ve yaralanmaları önlemek için kritik bir faktördür. Spor yaparken vücut daha fazla enerjiye ve protein ihtiyacı duyar.

Egzersiz öncesi hızlı emilen karbonhidrat ve az protein tüketilmesi önerilir. Egzersiz sonrası ise protein ve karbonhidrat kombinasyonu kas onarımını destekler.

Hidrasyon da oldukça önemlidir. Özellikle yoğun antrenman sırasında vücut çok su kaybeder. Spor sırasında ve sonrasında elektrolit içeren içecekler tüketilmesi performansı artırır.

Kas geliştirmek isteyenlerin protein ihtiyacı günde 1.2-2.0 gram/kg vücut ağırlığı kadardır.`
  },
  {
    id: 5,
    title: "Uyku ve Kilo İlişkisi",
    emoji: "😴",
    fullContent: `Kaliteli uyku, kilo kontrolü ve genel sağlık için beslenme kadar önemlidir. Yetersiz uyku, cortisol hormonunun artmasına neden olur ve kilo alımını tetikler.

Günde 7-9 saat kaliteli uyku alınması önerilir. Ancak sadece uyku saati değil, uykunun kalitesi de önemlidir. Düzenli uyku saati, karanlık bir ortam ve yatma öncesi teknoloji kullanımından kaçınmak uyku kalitesini iyileştirir.

Akşam saatlerinde parlak ışıklar, özellikle telefon, melatonin üretimini engeller. Yatmadan en az 1 saat önce teknoloji kullanımından kaçınmak tavsiye edilir.

Beslenme ve uyku dengesinin sağlanması kilo kontrolü ve sağlıklı yaşam için kritik öneme sahiptir.`
  }
];

function showBlogModal(index) {
  if (index < 0 || index >= BLOG_ARTICLES.length) return;

  const article = BLOG_ARTICLES[index];
  const modal = document.getElementById('blogModal');
  const title = document.getElementById('blogModalTitle');
  const content = document.getElementById('blogModalContent');
  if (!modal || !title || !content) return;

  title.textContent = `${article.emoji} ${article.title}`;
  // XSS-safe: split paragraphs and create elements
  content.innerHTML = '';
  article.fullContent.split('\n\n').forEach((para) => {
    const p = document.createElement('p');
    p.textContent = para;
    content.appendChild(p);
  });

  modal.classList.add('open');
}

function closeBlogModal() {
  const modal = document.getElementById('blogModal');
  if (modal) {
    modal.classList.remove('open');
    document.getElementById('blogModalContent').innerHTML = '';
  }
}
