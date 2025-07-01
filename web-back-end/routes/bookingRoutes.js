// routes/bookingRoutes.js
const router = require('express').Router();
const {
  createBooking,
  getUserBookings
} = require('../controllers/bookingController');
const { authenticate } = require('../middlewares/authMiddleware');

router.post('/:hotelId', authenticate, createBooking);
router.get('/', authenticate, getUserBookings);

module.exports = router;
