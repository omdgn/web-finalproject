// models/userModel.js
const db = require('../config/db');

const User = {
  // Yeni bir kullanıcı oluşturur (photo_url opsiyonel)
  async create(data) {
    const {
      email,
      passwordHash,
      name,
      country,
      city,
      role = 'user',
      photo_url = null
    } = data;
    const { rows } = await db.query(
      `INSERT INTO users
         (email, password_hash, name, country, city, role, photo_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING id, email, name, country, city, role, photo_url`,
      [email, passwordHash, name, country, city, role, photo_url]
    );
    return rows[0];
  },

  // Email’e göre kullanıcı bulur
  async findByEmail(email) {
    const { rows } = await db.query(
      `SELECT id, email, name, country, city, role, photo_url, password_hash
       FROM users WHERE email = $1`,
      [email]
    );
    return rows[0] || null;
  },

  // ID’ye göre kullanıcı bulur (profil için)
  async findById(id) {
    const { rows } = await db.query(
      `SELECT id, email, name, country, city, role, photo_url
       FROM users WHERE id = $1`,
      [id]
    );
    return rows[0] || null;
  },

  // Profil fotoğrafını günceller
  async updatePhoto(id, photo_url) {
    const { rows } = await db.query(
      `UPDATE users
          SET photo_url = $2,
              updated_at = now()
        WHERE id = $1
        RETURNING id, email, name, country, city, role, photo_url`,
      [id, photo_url]
    );
    return rows[0];
  }
};

module.exports = User;
