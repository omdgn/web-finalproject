// server.js
require('dotenv').config();
const express = require('express');
const passport = require('./config/passport');
const cors = require('cors');

const app = express();

// CORS ayarları (geliştirme ve deploy için güvenli)
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || '*';
app.use(cors({
  origin: CLIENT_ORIGIN,
  credentials: true,
}));

// JSON gövdelerini parse et
app.use(express.json());

// Passport’u başlat
app.use(passport.initialize());

// Statik klasör: yüklenen dosyalar
app.use('/uploads', express.static('uploads', {
  setHeaders: (res) => {
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

// Health-check
app.get('/', (_req, res) => res.send('API is running'));

// Route’ları import et
const authRoutes    = require('./routes/authRoutes');
const hotelRoutes   = require('./routes/hotelRoutes');
const commentRoutes = require('./routes/commentRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const uploadRoutes  = require('./routes/uploadRoutes');

// Middleware’leri import et
const { authenticate }    = require('./middlewares/authMiddleware');
const { errorMiddleware } = require('./middlewares/errorMiddleware');

// Auth
app.use('/auth', authRoutes);

// Otel
app.use('/hotels', hotelRoutes);

// Yorum
app.use('/comments', commentRoutes);

// Rezervasyon
app.use('/bookings', bookingRoutes);

// Görsel yükleme (genel dosyalar için)
app.use('/upload', uploadRoutes);

// Hata yakalama
app.use(errorMiddleware);

// 404 fallback (frontend SPA için veya API için)
app.use((req, res) => {
  res.status(404).json({ message: 'Kaynak bulunamadı.' });
});

// Sunucuyu başlat
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
