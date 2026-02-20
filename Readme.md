# 🍒 YaSem Diyet - Beslenme & Diyet Danışmanlığı Web Sitesi

## ✨ Özellikler

### 🎨 Tasarım
- ✅ Modern, şık ve profesyonel tasarım
- ✅ Kiraz temalı marka kimliği
- ✅ Smooth animasyonlar ve geçişler
- ✅ Tam responsive tasarım (mobil, tablet, desktop)

### 📱 Sayfa ve Özellikler
1. **Ana Sayfa**
   - Hero bölümü ile hoş geldin mesajı
   - Diyetisyen fotoğrafları (sol: Sema Polat, sağ: Yasemin Polat)
   - Marka logosu merkezi konumda
   - İstatistikler ve öne çıkan özellikler

2. **Hizmetlerimiz**
   - Hastalıklarda beslenme
   - Çocuk ve adölesan beslenmesi
   - Sporcu beslenmesi
   - Online diyet hizmeti (vurgulu)
   - Hamilelik ve emziklik dönemi
   
3. **Blog**
   - 6 adet blog yazısı
   - Modal pencerede detaylı okuma
   - Kategori ve tarih filtreleri

4. **VKİ Hesaplama**
   - Canlı vücut kitle indeksi hesaplayıcı
   - Değerlendirme tablosu
   - Öneriler ve uyarılar

5. **Başarı Galerisi**
   - Kaydırılabilir başarı hikayeleri
   - Müşteri testimonialları

6. **Randevu Sistemi**
   - Kullanıcı girişi/kaydı
   - 3 ofis seçeneği (Karacabey, Bandırma, Susurluk)
   - EMS cihazı uyarısı (Karacabey)
   - Randevu oluşturma ve iptal etme
   - Local storage ile veri saklama

### 🎯 Teknik Özellikler
- Sıfır bağımlılık (Vanilla JS)
- Local Storage ile veri yönetimi
- Modern CSS (Grid, Flexbox, Custom Properties)
- Smooth scroll ve animasyonlar
- Mobile-first yaklaşım

## 📂 Dosya Yapısı

```
yasem-diyet-final/
├── index.html       # Ana HTML dosyası
├── design.css       # Tüm stiller (2300+ satır)
├── connect.js       # JavaScript işlevleri (585 satır)
├── img/
│   └── yasem.png   # Logo dosyası
└── README.md        # Bu dosya
```

## 🚀 Kurulum

### Adım 1: Dosyaları İndirin
Tüm dosyaları bir klasöre kopyalayın.

### Adım 2: Logo Ekleyin
`img` klasörüne `yasem.png` logo dosyasını ekleyin.

### Adım 3: Çalıştırın
`index.html` dosyasını tarayıcınızda açın.

**Not:** Diyetisyen fotoğrafları için Unsplash'ten placeholder görseller kullanılmıştır. Gerçek fotoğraflarla değiştirmek için:
- HTML'de `.hero-dietitian img` etiketlerindeki `src` URL'lerini değiştirin
- Veya görselleri `img` klasörüne ekleyip yolu güncelleyin

## 🎨 Özelleştirme

### Renk Değişikliği
`design.css` dosyasındaki `:root` bölümünden renkleri özelleştirebilirsiniz:

```css
:root {
  --cherry: #C8392A;      /* Ana renk */
  --orange: #E87820;      /* İkincil renk */
  --cream: #FDF8F3;       /* Arka plan */
  /* ... */
}
```

### Diyetisyen Fotoğrafları
HTML'de hero bölümündeki görselleri değiştirin:

```html
<!-- Sema Polat -->
<img src="img/sema-polat.jpg" alt="Sema Polat">

<!-- Yasemin Polat -->
<img src="img/yasemin-polat.jpg" alt="Yasemin Polat">
```

### Logo Değiştirme
`img/yasem.png` dosyasını kendi logonuzla değiştirin.

## 🌐 Tarayıcı Desteği

- ✅ Chrome 90+ (önerilen)
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Opera 76+

## 📱 Responsive Breakpoints

- **Desktop:** 1200px+
- **Laptop:** 1024px - 1199px
- **Tablet:** 768px - 1023px
- **Mobile:** 480px - 767px
- **Small Mobile:** < 480px

## 🎯 Önemli Özellikler

### Diyetisyen Fotoğrafları Animasyonu
- Sol taraftan Sema Polat kayarak girer
- Sağ taraftan Yasemin Polat kayarak girer
- Sayfa açıldığında otomatik olarak görünür
- 1200px altında gizlenir (mobil uyumluluk için)

### Randevu Sistemi
- Kullanıcı kaydı gerekli
- Tarih ve saat seçimi
- Ofis bazlı randevu kontrolü
- EMS cihazı uyarısı (Karacabey)
- Randevu iptal etme

### Local Storage
- Kullanıcı bilgileri saklanır
- Randevular saklanır
- Sayfa yenilendiğinde veriler korunur

## 🔧 Geliştirme

### Yeni Hizmet Ekleme
`index.html` dosyasında hizmetler bölümüne yeni kart ekleyin:

```html
<div class="service-card">
  <div class="service-icon-wrap">🎯</div>
  <h3>Yeni Hizmet</h3>
  <p>Açıklama...</p>
</div>
```

### Yeni Blog Yazısı Ekleme
`connect.js` dosyasındaki `BLOG_ARTICLES` dizisine yeni makale ekleyin:

```javascript
{
  id: 6,
  title: "Başlık",
  emoji: "📝",
  fullContent: `İçerik...`
}
```

## 📞 Destek

Herhangi bir sorun veya soru için:
- 📧 Email:
- 📱 Telefon:

## 📄 Lisans

© 2026 YaSem Diyet – Beslenme & Diyet Danışmanlığı. Tüm hakları saklıdır.

---

**Not:** Bu bir demo/geliştirme versiyonudur. Canlıya almadan önce:
1. Gerçek diyetisyen fotoğraflarını ekleyin
2. İletişim bilgilerini güncelleyin
3. Logo dosyasını ekleyin
4. Domain ve hosting ayarlayın
5. SEO optimizasyonu yapın
6. Google Analytics ekleyin

**Geliştirici Notu:** Diyetisyen fotoğrafları CSS'te `slideInFromLeft` ve `slideInFromRight` animasyonları ile sayfa yüklendiğinde otomatik olarak görünür hale gelir. Animasyon süresi 1 saniye, 0.2 saniye gecikme ile başlar.
