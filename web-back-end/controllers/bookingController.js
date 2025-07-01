// controllers/bookingController.js
const Booking = require('../models/bookingModel');
const Hotel   = require('../models/hotelModel');

exports.createBooking = async (req, res, next) => {
  try {
    const { hotelId } = req.params;
    const { startDate, endDate, guests } = req.body;
    if (!startDate || !endDate || !guests) {
      return res.status(400).json({ message: 'startDate, endDate ve guests gerekli.' });
    }

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: 'Otel bulunamadı.' });
    }

    const sd = new Date(startDate);
    const ed = new Date(endDate);
    const nights = Math.round((ed - sd) / (24 * 60 * 60 * 1000));
    if (nights < 1) {
      return res.status(400).json({ message: 'endDate, startDate’den sonraki bir tarih olmalı.' });
    }

    const totalPrice = nights * Number(hotel.price_per_night) * guests;
    const booking = await Booking.create({
      userId: req.user.userId,
      hotelId,
      startDate,
      endDate,
      guests,
      totalPrice
    });

    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
};

exports.getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.findByUser(req.user.userId);
    res.json(bookings);
  } catch (err) {
    next(err);
  }
};
