// routes/hotelRoutes.js
const router = require('express').Router();
const {
  createHotel,
  listHotels,
  getHotelById,
  searchHotels,
  searchWeekend
} = require('../controllers/hotelController');
const { authenticate } = require('../middlewares/authMiddleware');

// 1) Otel oluştur (auth gerekli)
router.post('/', authenticate, createHotel);

// 2) Tüm otelleri listeleme
router.get('/', listHotels);

// 3) Esnek arama (parametreli :id’den önce!)
router.get('/search', searchHotels);

// 4) Hafta sonu filtresi (parametreli :id’den önce!)
router.get('/weekend', authenticate, searchWeekend);

// 5) Otel detay (parametreli route en sonda olmalı)
router.get('/:id', getHotelById);

module.exports = router;
