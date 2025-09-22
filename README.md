# 🧡 lexpert - Dava Avukat Eşleştirme Asistanı

Yapay zeka destekli akıllı eşleştirme sistemi ile en uygun avukatı saniyeler içinde bulun.

## 📋 Proje Hakkında

lexpert, dava türlerine göre en uygun avukatları bulan yapay zeka destekli bir eşleştirme platformudur. Sistem, dava özelliklerini analiz ederek avukatların uzmanlık alanları, deneyimleri ve başarı oranlarına göre akıllı eşleştirmeler yapar.

## ✨ Özellikler

### 🎯 Ana Özellikler
- **Yapay Zeka Eşleştirme**: Dava türü ve avukat uzmanlığına göre akıllı eşleştirme
- **Hızlı Eşleştirme**: Ana sayfadan tek tıkla avukat önerileri
- **Detaylı Analiz**: Eşleştirme skorları ve gerekçeleri
- **Avukat Profilleri**: Detaylı avukat bilgileri ve deneyim
- **Dava Yönetimi**: Kapsamlı dava ekleme, düzenleme ve listeleme

### 🔧 Teknik Özellikler
- **Modern UI/UX**: Responsive ve kullanıcı dostu arayüz
- **Gerçek Zamanlı**: Anlık eşleştirme sonuçları
- **Filtreleme**: Şehir, uzmanlık alanı ve diğer kriterlere göre filtreleme
- **Arama**: Gelişmiş arama ve sıralama özellikleri
- **Audit Trail**: Değişiklik takibi ve son işlem tarihleri

## 🛠 Teknoloji Stack

### Frontend
- **React 18** - Modern JavaScript framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Toastify** - Bildirim sistemi
- **CSS3** - Custom styling ve animasyonlar

### Backend
- **.NET 9** - Web API framework
- **Entity Framework Core** - ORM
- **SQL Server** - Veritabanı
- **AutoMapper** - Object mapping
- **Docker** - Containerization

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+
- .NET 9 SDK
- SQL Server 2019+
- Docker (opsiyonel)

### 1. Projeyi Klonlayın
```bash
git clone https://github.com/username/dava-avukat-eslestirme-asistani.git
cd dava-avukat-eslestirme-asistani
```

### 2. Backend Kurulumu
```bash
cd api
dotnet restore
dotnet ef database update
dotnet run
```

### 3. Frontend Kurulumu
```bash
cd ui
npm install
npm start
```

### 4. Docker ile Kurulum (Opsiyonel)
```bash
# SQL Server container'ı başlat
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourStrong!Passw0rd" -p 1433:1433 --name sqlserver -d mcr.microsoft.com/mssql/server:2019-latest

# API ve UI'ı başlat
cd api && dotnet run
cd ui && npm start
```

## 📊 Veritabanı Yapısı

### Ana Tablolar
- **Cases**: Dava bilgileri ve detayları
- **Lawyers**: Avukat profilleri ve uzmanlık alanları
- **WorkingGroups**: Çalışma grupları ve uzmanlık kategorileri
- **CaseLawyerMatches**: Eşleştirme sonuçları ve skorları

### Audit Özellikleri
- `LastModified`: Son değişiklik tarihi
- `CreatedAt`: Oluşturulma tarihi
- `IsDeleted`: Soft delete durumu

## 🎨 UI/UX Tasarım Sistemi

### Renk Paleti
- **Primary**: `#FF6F61` (Turuncu)
- **Success**: `#FF6F61` (Turuncu - tutarlılık için)
- **Error**: `#ef4444` (Kırmızı)
- **Warning**: `#f59e0b` (Sarı)
- **Info**: `#3b82f6` (Mavi)

### Bileşenler
- **Buttons**: Tutarlı padding ve hover efektleri
- **Forms**: Grid layout ve responsive tasarım
- **Modals**: Turuncu header ve modern görünüm
- **Toast**: Tutarlı bildirim sistemi
- **Tables**: Responsive ve filtrelenebilir

## 📱 Sayfa Yapısı

### Ana Sayfalar
- **/** - Ana sayfa (Hızlı eşleştirme)
- **/davalar** - Dava listesi
- **/davalar/yeni** - Yeni dava ekleme
- **/davalar/:id/detay** - Dava detayları
- **/davalar/:id/duzenle** - Dava düzenleme
- **/lawyers** - Avukat listesi
- **/lawyer-add** - Avukat ekleme
- **/match** - Detaylı eşleştirme
- **/match-results** - Eşleştirme sonuçları

## 🔄 API Endpoints

### Davalar
```
GET    /api/cases          - Dava listesi
POST   /api/cases          - Yeni dava
GET    /api/cases/{id}     - Dava detayı
PUT    /api/cases/{id}     - Dava güncelle
DELETE /api/cases/{id}     - Dava sil
```

### Avukatlar
```
GET    /api/lawyers        - Avukat listesi
POST   /api/lawyers        - Yeni avukat
GET    /api/lawyers/{id}   - Avukat detayı
PUT    /api/lawyers/{id}   - Avukat güncelle
DELETE /api/lawyers/{id}   - Avukat sil
```

### Eşleştirme
```
POST   /api/match/suggest  - Eşleştirme önerisi
POST   /api/match/choose   - Eşleştirme seçimi
GET    /api/match/history  - Eşleştirme geçmişi
```

## 🧪 Test

### Frontend Testleri
```bash
cd ui
npm test
```

### Backend Testleri
```bash
cd api
dotnet test
```

## 📈 Performans

### Optimizasyonlar
- **Lazy Loading**: Sayfa bazlı kod bölme
- **Caching**: API response cache
- **Pagination**: Büyük listelerde sayfalama
- **Debouncing**: Arama inputlarında gecikme
- **Memoization**: React bileşenlerinde optimizasyon

### Metrics
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Lighthouse Score**: 90+

## 🔒 Güvenlik

### Implemented
- **Input Validation**: Tüm form girişlerinde doğrulama
- **SQL Injection Protection**: Entity Framework parametreli sorgular
- **CORS**: Controlled cross-origin resource sharing
- **Error Handling**: Güvenli hata mesajları

### Todo
- JWT Authentication
- Role-based Authorization
- Rate Limiting
- HTTPS Enforcement

## 📝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some AmazingFeature'`)
4. Branch'inizi push edin (`git push origin feature/AmazingFeature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

## 👥 Ekip

- **Frontend Developer**: React, UI/UX Implementation
- **Backend Developer**: .NET, Database Design
- **DevOps Engineer**: Docker, Deployment

## 📞 İletişim

- **Email**: info@lexpert.com
- **Website**: https://lexpert.com
- **GitHub**: https://github.com/username/dava-avukat-eslestirme-asistani

## 🔄 Changelog

### v1.0.0 (2025-09-22)
- ✅ İlk stabil sürüm
- ✅ Yapay zeka eşleştirme sistemi
- ✅ Responsive UI/UX tasarımı
- ✅ Kapsamlı CRUD operasyonları
- ✅ Audit trail sistemi
- ✅ Toast bildirim sistemi
- ✅ Tutarlı renk paleti (turuncu tema)

---

**lexpert** ile hukuki eşleştirmelerde yeni bir dönem başlıyor! 🧡⚖️
