
<!-- PROJECT SHIELDS -->
<!-- Replace with your own badges or remove what you don’t need -->
<p align="center">
  <a href="https://github.com/omdgn/web-finalproject/actions">
    <img alt="Build Status" src="https://img.shields.io/github/workflow/status/omdgn/web-finalproject/CI?style=for-the-badge" />
  </a>
  <a href="https://github.com/omdgn/web-finalproject/releases">
    <img alt="Release" src="https://img.shields.io/github/v/release/omdgn/web-finalproject?style=for-the-badge" />
  </a>
  <a href="LICENSE">
    <img alt="License: MIT" src="https://img.shields.io/github/license/omdgn/web-finalproject?style=for-the-badge" />
  </a>
  <a href="https://github.com/omdgn/web-finalproject/issues">
    <img alt="Issues" src="https://img.shields.io/github/issues/omdgn/web-finalproject?style=for-the-badge" />
  </a>
</p>

---

# 🏨 Hotel-Booking-Project

**Hotel Booking** uygulaması—tam yığın (full-stack) demo.

- **Front-end** (`web-front-end`)  
  TypeScript + HTML + CSS; React tabanlı SPA, Vercel deploy.  
- **Back-end** (`web-back-end`)  
  Node.js + Express + TypeScript; PostgreSQL ile REST API.

---

## 📋 İçindekiler

1. [Demo](#-demo)  
2. [Özellikler](#-özellikler)  
3. [Mimari](#-mimari)  
4. [Önkoşullar](#-önkoşullar)  
5. [Kurulum & Çalıştırma](#️-kurulum--çalıştırma)  
6. [API Dokümantasyonu](#-api-dokümantasyonu)  
7. [Klasör Yapısı](#-klasör-yapısı)  
8. [Katkıda Bulunanlar](#-katkıda-bulunanlar)  
9. [Lisans](#-lisans)  

---

## 🚀 Demo

Canlı preview:  
[https://hotel-booking-app-bay-five.vercel.app](https://hotel-booking-app-bay-five.vercel.app)

---

## 📦 Özellikler

- 🏙️ Şehir, fiyat aralığı, olanaklar (amenities) ile **otelleri filtreleme**  
- 📋 Otel detayları: konum (geocoding), resimler, fiyat, indirim yüzdesi  
- 💬 Yorum ve puan ekleme (kimlik doğrulama gerekli)  
- 🔀 Fiyat, puan, mesafe vb. **sıralama** seçenekleri  
- 📱 **Responsive** tasarım: mobil & masaüstü  

---


- **Front-end**  
  - React + TypeScript  
  - REST API tüketimi  
  - Vercel ile otomatik deploy  
- **Back-end**  
  - Express.js + TypeScript  
  - Modüler controller & route yapısı  
  - PostgreSQL bağlantısı  
  - .env tabanlı yapılandırma  

---

## 🔧 Önkoşullar

- Node.js ≥ v16  
- npm veya yarn  
- PostgreSQL (veya tercihinize göre SQL veritabanı)  
- (Opsiyonel) Vercel CLI  

---

## ⚙️ Kurulum & Çalıştırma

### 1. Depoyu klonla  
```bash
git clone https://github.com/omdgn/web-finalproject.git
cd web-finalproject


