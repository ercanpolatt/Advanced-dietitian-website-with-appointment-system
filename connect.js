/**
 * YaSem Diyet – Beslenme & Diyet Danışmanlığı
 * Main JavaScript Controllers & Application Logic
 * @author YaSem Team
 */

/* ═══════════════════════════════════════════════════════════════════════════
   APPLICATION STATE
═══════════════════════════════════════════════════════════════════════════ */

const APP = {
  currentUser: null,
  appointments: [],
  slideIndex: 0,
  TOTAL_SLIDES: 2,
  STORAGE_KEYS: {
    USER: 'yasem_user',
    APPOINTMENTS: 'yasem_appointments'
  }
};

/* ═══════════════════════════════════════════════════════════════════════════
   INITIALIZATION
═══════════════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
  setupEventListeners();
  loadUserSession();
});

function initializeApp() {
  // Set minimum date for appointment booking to today
  const today = new Date().toISOString().split('T')[0];
  const appointmentDateInput = document.getElementById('appointmentDate');
  if (appointmentDateInput) {
    appointmentDateInput.setAttribute('min', today);
  }
}

function setupEventListeners() {
  // Navbar scroll effect
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });

  // Modal backdrop click
  document.querySelectorAll('.modal-overlay').forEach((overlay) => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal(overlay.id);
      }
    });
  });

  // Mobile menu backdrop click
  const mobileMenu = document.getElementById('mobileMenu');
  if (mobileMenu) {
    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu) {
        toggleMobileMenu();
      }
    });
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   NAVBAR & SCROLL HANDLING
═══════════════════════════════════════════════════════════════════════════ */

function handleNavbarScroll() {
  const navbar = document.getElementById('navbar');
  const isScrolled = window.scrollY > 20;
  
  if (isScrolled) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION NAVIGATION
═══════════════════════════════════════════════════════════════════════════ */

function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll('section').forEach((section) => {
    section.classList.remove('active');
  });

  // Show selected section
  const selectedSection = document.getElementById(sectionId);
  if (selectedSection) {
    selectedSection.classList.add('active');
  }

  // Smooth scroll to top
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });

  // Update active nav link
  updateActiveNavLink(sectionId);

  // Refresh section-specific content
  if (sectionId === 'randevu') {
    refreshAppointmentSection();
  }
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
  const mobileMenu = document.getElementById('mobileMenu');
  const hamburger = document.getElementById('navHamburger');

  if (mobileMenu && hamburger) {
    mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('active');
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   GALLERY / CAROUSEL
═══════════════════════════════════════════════════════════════════════════ */

function goSlide(slideNumber) {
  APP.slideIndex = slideNumber;
  const galleryTrack = document.getElementById('galleryTrack');
  if (galleryTrack) {
    galleryTrack.style.transform = `translateX(-${slideNumber * 100}%)`;
  }

  // Update dots
  document.querySelectorAll('.g-dot').forEach((dot, index) => {
    dot.classList.toggle('active', index === slideNumber);
  });
}

function nextSlide() {
  goSlide((APP.slideIndex + 1) % APP.TOTAL_SLIDES);
}

function prevSlide() {
  goSlide((APP.slideIndex - 1 + APP.TOTAL_SLIDES) % APP.TOTAL_SLIDES);
}

/* ═══════════════════════════════════════════════════════════════════════════
   BMI CALCULATOR
═══════════════════════════════════════════════════════════════════════════ */

function calculateBMI() {
  const height = parseFloat(document.getElementById('height').value);
  const weight = parseFloat(document.getElementById('weight').value);

  // Validation
  if (!height || !weight || height < 50 || height > 300 || weight < 10 || weight > 500) {
    showAlert('Lütfen geçerli boy (50-300 cm) ve kilo (10-500 kg) değerleri girin.', 'warning');
    return;
  }

  // Calculate BMI
  const bmi = (weight / (Math.pow(height / 100, 2))).toFixed(1);

  // Determine category
  let category, advice;
  if (bmi < 18.5) {
    category = 'Zayıf';
    advice = 'Sağlıklı kilo almanız için profesyonel destek almanızı öneririz.';
  } else if (bmi < 25) {
    category = 'Normal ✅';
    advice = 'Harika! Sağlıklı bir kiloya sahipsiniz. Dengeli beslenmeye devam edin.';
  } else if (bmi < 30) {
    category = 'Fazla Kilolu';
    advice = 'Sağlıklı kilo vermeniz için kişiye özel bir beslenme programı oluşturabiliriz.';
  } else {
    category = 'Obez';
    advice = 'Sağlığınız için profesyonel destek almanız çok önemli. Hemen randevu alın.';
  }

  // Display results
  const bmiResult = document.getElementById('bmiResult');
  document.getElementById('bmiValue').textContent = bmi;
  document.getElementById('bmiCategory').textContent = category;
  document.getElementById('bmiAdvice').textContent = advice;
  bmiResult.classList.add('show');
}

/* ═══════════════════════════════════════════════════════════════════════════
   AUTHENTICATION
═══════════════════════════════════════════════════════════════════════════ */

function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('open');
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('open');
  }
}

function login() {
  const name = document.getElementById('loginName').value.trim();
  const phone = document.getElementById('loginPhone').value.trim();
  const email = document.getElementById('loginEmail').value.trim();

  // Validation
  if (!name || !phone || !email) {
    showAlert('Lütfen tüm alanları doldurun.', 'warning');
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showAlert('Lütfen geçerli bir e-posta adresi girin.', 'warning');
    return;
  }

  // Create user object
  APP.currentUser = {
    name,
    phone,
    email,
    loginTime: new Date().toISOString()
  };

  // Save to localStorage
  localStorage.setItem(APP.STORAGE_KEYS.USER, JSON.stringify(APP.currentUser));

  // Update UI
  refreshUserUI();
  closeModal('loginModal');
  showSection('randevu');
  showAlert('Hoşgeldiniz! Randevu almaya hazırsınız.', 'success');
}

function logout() {
  APP.currentUser = null;
  localStorage.removeItem(APP.STORAGE_KEYS.USER);
  
  // Update UI
  document.getElementById('loginBtn').classList.remove('hidden');
  document.getElementById('logoutBtn').classList.add('hidden');
  document.getElementById('userGreeting').classList.add('hidden');
  
  showAlert('Çıkış yapıldı.', 'info');
  showSection('ana-sayfa');
}

function refreshUserUI() {
  if (!APP.currentUser) return;

  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const userGreeting = document.getElementById('userGreeting');

  loginBtn.classList.add('hidden');
  logoutBtn.classList.remove('hidden');
  
  const firstName = APP.currentUser.name.split(' ')[0];
  userGreeting.textContent = `Merhaba, ${firstName} 👋`;
  userGreeting.classList.remove('hidden');
}

function loadUserSession() {
  try {
    const storedUser = localStorage.getItem(APP.STORAGE_KEYS.USER);
    if (storedUser) {
      APP.currentUser = JSON.parse(storedUser);
      refreshUserUI();
    }

    const storedAppointments = localStorage.getItem(APP.STORAGE_KEYS.APPOINTMENTS);
    if (storedAppointments) {
      APP.appointments = JSON.parse(storedAppointments);
    }
  } catch (error) {
    console.error('Error loading session:', error);
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   APPOINTMENT MANAGEMENT
═══════════════════════════════════════════════════════════════════════════ */

function updateOfficeInfo() {
  const officeSelect = document.getElementById('office');
  const emsInfo = document.getElementById('emsInfo');
  
  if (officeSelect && emsInfo) {
    const isKaracabey = officeSelect.value === 'karacabey';
    emsInfo.classList.toggle('hidden', !isKaracabey);
  }
}

function refreshAppointmentSection() {
  const hasUser = !!APP.currentUser;
  const loginRequired = document.getElementById('loginRequired');
  const appointmentForm = document.getElementById('appointmentForm');
  const myAppointments = document.getElementById('myAppointments');

  if (loginRequired) loginRequired.classList.toggle('hidden', hasUser);
  if (appointmentForm) appointmentForm.classList.toggle('hidden', !hasUser);
  if (myAppointments) myAppointments.classList.toggle('hidden', !hasUser);

  if (hasUser) {
    renderAppointments();
  }
}

function submitAppointment(event) {
  event.preventDefault();

  const office = document.getElementById('office').value;
  const date = document.getElementById('appointmentDate').value;
  const time = document.getElementById('appointmentTime').value;
  const service = document.getElementById('serviceType').value;
  const notes = document.getElementById('notes').value;

  // Validation
  if (!office || !date || !time || !service) {
    showAlert('Lütfen zorunlu alanları doldurun.', 'warning');
    return;
  }

  // Check for appointment conflicts (same office, date, and time)
  const appointmentConflict = APP.appointments.some(appt => 
    appt.office === office && appt.date === date && appt.time === time
  );

  if (appointmentConflict) {
    showAlert('❌ Bu saat ve tarihte bu ofiste randevu dolu. Lütfen başka bir zaman seçin.', 'warning');
    return;
  }

  // Create appointment object
  const appointment = {
    id: Date.now(),
    userName: APP.currentUser.name,
    userPhone: APP.currentUser.phone,
    userEmail: APP.currentUser.email,
    office,
    date,
    time,
    service,
    notes,
    createdAt: new Date().toISOString(),
    status: 'confirmed'
  };

  // Add to appointments array
  APP.appointments.push(appointment);

  // Save to localStorage
  localStorage.setItem(APP.STORAGE_KEYS.APPOINTMENTS, JSON.stringify(APP.appointments));

  // Show success message
  showAlert('✅ Randevunuz başarıyla oluşturuldu! Telefon numaranızdan teyit aranacaktır.', 'success');

  // Reset form
  event.target.reset();
  document.getElementById('emsInfo').classList.add('hidden');

  // Refresh appointments list
  renderAppointments();
}

function renderAppointments() {
  if (!APP.currentUser) return;

  const appointmentsList = document.getElementById('appointmentsList');
  if (!appointmentsList) return;

  // Filter appointments for current user
  const userAppointments = APP.appointments.filter(
    (appt) => appt.userName === APP.currentUser.name
  );

  if (userAppointments.length === 0) {
    appointmentsList.innerHTML = `
      <p style="font-size: 0.85rem; color: var(--mid); text-align: center; padding: 2rem 0;">
        Henüz randevunuz bulunmuyor. Yeni randevu oluşturmak için formu doldurun.
      </p>
    `;
    return;
  }

  const officeLabels = {
    karacabey: 'Karacabey',
    bandirma: 'Bandırma',
    susurluk: 'Susurluk'
  };

  appointmentsList.innerHTML = userAppointments
    .map((appt) => {
      const officeName = officeLabels[appt.office] || appt.office;
      const appointmentDate = new Date(appt.date);
      const formattedDate = appointmentDate.toLocaleDateString('tr-TR', {
        weekday: 'short',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      return `
        <div class="appt-item">
          <div class="appt-item-left">
            <div class="appt-item-loc">🏥 ${officeName}</div>
            <div class="appt-item-time">${formattedDate} • ${appt.time}</div>
            <div class="appt-item-service">${appt.service}</div>
          </div>
          <button class="btn-cancel-appt" onclick="cancelAppointment(${appt.id})">
            İptal Et
          </button>
        </div>
      `;
    })
    .join('');
}

function cancelAppointment(appointmentId) {
  if (!confirm('Randevunuzu iptal etmek istediğinizden emin misiniz?')) {
    return;
  }

  // Remove appointment
  APP.appointments = APP.appointments.filter((appt) => appt.id !== appointmentId);

  // Save to localStorage
  localStorage.setItem(APP.STORAGE_KEYS.APPOINTMENTS, JSON.stringify(APP.appointments));

  // Update UI
  showAlert('ℹ️ Randevunuz iptal edildi.', 'info');
  renderAppointments();
}

/* ═══════════════════════════════════════════════════════════════════════════
   UTILITY FUNCTIONS
═══════════════════════════════════════════════════════════════════════════ */

function showAlert(message, type = 'info') {
  const alertBox = document.getElementById('apptFeedback');
  if (!alertBox) return;

  const alertClass = `alert-${type}`;
  alertBox.innerHTML = `<div class="alert-box ${alertClass}">${message}</div>`;

  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    alertBox.innerHTML = '';
  }, 5000);
}

/**
 * Smooth scroll to element
 * @param {string} elementId - ID of element to scroll to
 */
function smoothScrollTo(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

/**
 * Format date to readable format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Format time to HH:MM format
 * @param {string} timeString - Time string
 * @returns {string} Formatted time
 */
function formatTime(timeString) {
  return timeString || '—';
}

/* ═══════════════════════════════════════════════════════════════════════════
   PERFORMANCE OPTIMIZATION
═══════════════════════════════════════════════════════════════════════════ */

// Debounce function for scroll events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for resize events
function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
   MOBILE NAVIGATION
═══════════════════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════════════════
   FORM VALIDATION
═══════════════════════════════════════════════════════════════════════════ */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid
 */
function validatePhone(phone) {
  const regex = /^[0-9\-\+\s\(\)]{10,}$/;
  return regex.test(phone);
}

/* ═══════════════════════════════════════════════════════════════════════════
   ANALYTICS & TRACKING (Optional)
═══════════════════════════════════════════════════════════════════════════ */

/**
 * Track user actions
 * @param {string} action - Action name
 * @param {object} data - Additional data
 */
function trackEvent(action, data = {}) {
  // This can be connected to Google Analytics or custom analytics
  console.log(`Event: ${action}`, data);
}

/* ═══════════════════════════════════════════════════════════════════════════
   BLOG MODAL SYSTEM
═══════════════════════════════════════════════════════════════════════════ */

// Blog articles database
const BLOG_ARTICLES = [
  {
    id: 0,
    title: "Dengeli Beslenmenin Önemi",
    emoji: "🍽️",
    fullContent: `Dengeli beslenme, vücudumuzun normal işlevini sürdürmesi için gerekli tüm besin öğelerini doğru oranlarda almak anlamına gelir. Karbonhidratlar, proteinler, yağlar, vitaminler, mineraller ve su gibi besin öğeleri her yaşta sağlığımızı korumak için gereklidir.

Beslenme dengesizliği obezite, diyabet, kalp hastalıkları ve birçok kronik hastalığın temel sebebidir. Bir gün içinde alınan kalori miktarının %50-65'i karbonhidratlardan, %10-35'i proteinlerden, %20-35'i yağlardan gelmesi önerilir.

YaSem Diyet'te, kişinin yaşı, aktivite seviyesi, sağlık durumu ve hedefleri doğrultusunda özel dengelenmiş beslenme programları hazırlıyoruz. Beslenme danışmanlarımız, her hastaya uygun bir beslenme planı oluşturarak, sağlıklı yaşamı ve ideal kilo kontrolünü destekleriz.

Çoğu zaman insanlar yanlış diyet uygulamalarına başvururlar ve bu kısa süreli sonuçlar verse de uzun vadede vücuda zarar verir. Dengeli beslenme, kalıcı sonuçlar için en etkili yoldur.`
  },
  {
    id: 1,
    title: "Su İçmenin Önemi ve Faydaları",
    emoji: "💧",
    fullContent: `Su, insan vücudunun %60-70'ini oluşturan ve yaşam için vazgeçilmez olan birincil elementtir. Yeterli su tüketimi metabolizmayı hızlandırır, vücuttan toksitleri temizler, cilt sağlığını iyileştirir, enerji seviyesini artırır ve kilo kontrolünü destekler.

Günde en az 8-10 bardak (2-3 litre) su içilmesi önerilir. Ancak su ihtiyacı kişinin yaşı, cinsiyeti, aktivite seviyesi ve iklim koşullarına göre değişebilir. Egzersiz yapanlar, hamile ve emzikli kadınlar, yaz mevsiminde daha fazla su tüketmeleri gerekir.

Yetersiz su tüketimi yorgunluk, baş ağrısı, düşük konsantrasyon, cilt sorunları ve hatta kilo almaya yol açabilir. Su sadece susuzluğu gidermez, aynı zamanda besin emilimini de artırır.

YaSem Diyet danışmanları, su tüketim alışkanlığını da beslenme programının bir parçası olarak değerlendirir ve kişiye özel su tüketim planı oluştururuz. Suyun yanında mevsimsel meyve suları ve bitkisel çaylar da tüketilebilir.`
  },
  {
    id: 2,
    title: "Kış Mevsimi Meyve ve Sebzeleri",
    emoji: "🎃",
    fullContent: `Kış mevsiminde tüketilen meyve ve sebzeler, doğal mevsim döngüsüne uymuş olduğundan daha lezzetli ve besleyicidir. Portakal, mandalina, limon, greyfurt gibi sitrus meyveler C vitamini açısından zengindir ve bağışıklık sistemini güçlendirir.

Lahana, brokoli, pırasa, havuç, pancar ve karalahana kış sebzeleri arasında yer alır. Bu sebzelerin tümü vitamin, mineral ve antioksidanlar bakımından olukça zengindir. Kış sebzelerindeki beta karoten, C vitamini ve diğer antioksidanlar vücudu soğuk mevsim hastalıklarından korur.

Yerel ve mevsimsel ürünler hem daha ucuz hem de daha sağlıklıdır. Çiftçilerden doğrudan taze ürün satın almak daha sağlıklıdır. Kış mevsiminde bu ürünleri bolca tüketmek bağışıklığınızı güçlü hale getirecektir.

Ayrıca bu sebzeler daha az pestisit içerir ve çevre için daha sürdürülebilir seçeneklerdir. YaSem Diyet'te mevsimsel yemek hazırlanmasında uzmanlaşmış danışmanlarız size rehberlik edebilir.`
  },
  {
    id: 3,
    title: "Sağlıklı Yağlar Rehberi",
    emoji: "🥑",
    fullContent: `Yağlar besin zincirinin önemli bir parçasıdır ve tümü zararlı değildir. Antioksidanlar açısından zengin olan avokado, zeytinyağı, balık yağı ve kuruyemişlerdeki yağlar "iyi yağlar" olarak bilinir ve kalp sağlığını korur.

Bu "iyi yağlar" özellikle enerji veren ve hormonal sistemin düzgün çalışmasında gerekilidir. Omega-3 yağ asitleri, beyin sağlığı, anti-inflamasyon ve kalp hastalıklarından koruma sağlar. Çoğu balık, özellikle somon, uskumru ve geridan omega-3 açısından zengindir.

Bunun aksine hayvan kökenli doymuş yağlar ve trans yağlar zararlıdır. Bu tür yağlar kolesterol seviyesini artırır ve kalp hastalıkları riskini yükseltir. Beslenme programınızda yağ oranını kontrol etmek önemlidir.

Günde 25-35 gram yağ alınması önerilir, ancak bu yağlar sağlıklı kaynaklardan gelmelidir. YaSem Diyet uzmanları, yağ seçimi ve pişirme yöntemleri hakkında ayrıntılı bilgi sağlar.`
  },
  {
    id: 4,
    title: "Spor ve Beslenme İlişkisi",
    emoji: "🏋️",
    fullContent: `Sporcu beslenme, performansı artırmak, kasları geliştirmek ve yaralanmaları önlemek için kritik bir faktördür. Spor yaparken vücud daha fazla enerjiye, protein ihtiyacı duyar ve elektrolit dengesinin korunması gerekir.

Egzersiz öncesi hızlı emilen karbonhidrat (muz, fındık ezmesi gibi) ve az protein tüketilmesi önerilir. Egzersiz sonrası ise protein ve karbonhidrat kombinasyonu kas onarımını destekler. Antrenmanın 30-60 dakika sonrasında beslenme en etkilidir.

Hidrasyon da oldukça önemlidir. Özellikle yoğun antrenman sırasında vücut çok su kaybeder. Spor sırasında ve sonrasında elektrolit içeren içecekler tüketilmesi performansı artırır.

Sporcu yağ oranı da normal insanlardan farklı olmalıdır. Kas geliştirmek isteyenlerin protein ihtiyacı günde 1.2-2.0 gram/kg vücut ağırlığı kadardır. Düzenli sporla uğraşanlar için kişiye özel beslenme programları hazırlama konusunda YaSem Diyet ile çalışabilirsiniz.`
  },
  {
    id: 5,
    title: "Uyku ve Kilo İlişkisi",
    emoji: "😴",
    fullContent: `Kaliteli uyku, kilo kontrolü ve genel sağlık için beslenme kadar önemlidir. Yetersiz uyku, cortisol hormonunun artmasına neden olur ve kilo alımını tetikler. Ayrıca uyku yoksunluğu insülin direncini artırır ve şeker tüketme isteğini arttırır.

Günde 7-9 saat kaliteli uyku alınması önerilir. Ancak sadece uyku saati değil, uykunun kalitesi de önemlidir. Düzenli uyku saati, karanlık bir ortam ve yatma öncesi teknoloji kullanımından kaçınmak uyku kalitesini iyileştirir.

Uyku hormonu olan melatoninin üretimi, karanlıkta ve sessiz ortamda daha iyi gerçekleşir. Akşam saatlerinde parlak ışıklar (özellikle telefon), melatonin üretimini engeller. Yatmadan en az 1 saat önce teknoloji kullanımından kaçınmak tavsiye edilir.

Beslenme ve uyku dengesinin sağlanması kilo kontrolü ve sağlıklı yaşam için kritik öneme sahiptir. YaSem Diyet danışmanları, uyku kalitesini artıran beslenme önerileri sunabilir.`
  }
];

/**
 * Open blog modal with specific article
 * @param {number} index - Article index in BLOG_ARTICLES array
 */
function showBlogModal(index) {
  if (index < 0 || index >= BLOG_ARTICLES.length) {
    console.warn('Invalid blog article index');
    return;
  }

  const article = BLOG_ARTICLES[index];
  const modal = document.getElementById('blogModal');
  const title = document.getElementById('blogModalTitle');
  const content = document.getElementById('blogModalContent');

  if (!modal || !title || !content) {
    console.warn('Blog modal elements not found');
    return;
  }

  // Update modal content
  title.textContent = `${article.emoji} ${article.title}`;
  content.innerHTML = `<p>${article.fullContent.split('\n\n').join('</p><p>')}</p>`;

  // Open modal
  modal.classList.add('open');
  trackEvent('blog_article_opened', { articleId: article.id, title: article.title });
}

/**
 * Close blog modal
 */
function closeBlogModal() {
  const modal = document.getElementById('blogModal');
  if (modal) {
    modal.classList.remove('open');
    // Reset content
    document.getElementById('blogModalContent').innerHTML = '';
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   EXPORT FOR TESTING
═══════════════════════════════════════════════════════════════════════════ */

// Uncomment if using ES modules
// export { APP, showSection, calculateBMI, login, logout };
