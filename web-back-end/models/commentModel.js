// models/commentModel.js
const db = require('../config/db');

const Comment = {
  async create({ userId, hotelId, rating, text }) {
    const { rows } = await db.query(
      `INSERT INTO comments (user_id, hotel_id, rating, text)
       VALUES ($1,$2,$3,$4)
       RETURNING *`,
      [userId, hotelId, rating, text]
    );
    return rows[0];
  },

  async findByHotel(hotelId) {
    const { rows } = await db.query(
      `SELECT * FROM comments
       WHERE hotel_id = $1
       ORDER BY created_at DESC`,
      [hotelId]
    );
    return rows;
  }
};

module.exports = Comment;
