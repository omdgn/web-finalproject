// models/bookingModel.js
const db = require('../config/db');

const Booking = {
  async create({ userId, hotelId, startDate, endDate, guests, totalPrice }) {
    const { rows } = await db.query(
      `INSERT INTO bookings
         (user_id, hotel_id, start_date, end_date, guests, total_price)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING *`,
      [userId, hotelId, startDate, endDate, guests, totalPrice]
    );
    return rows[0];
  },

  async findByUser(userId) {
    const { rows } = await db.query(
      `SELECT * FROM bookings
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );
    return rows;
  }
};

module.exports = Booking;
