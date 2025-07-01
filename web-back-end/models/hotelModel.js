// models/hotelModel.js
const db = require('../config/db');

const Hotel = {
  // 1) Yeni otel oluşturma
  async create(data) {
    const {
      name, city, country, pricePerNight,
      x_longitude, y_latitude, amenities,
      hotel_image_url, discount_percentage = 0
    } = data;
    const { rows } = await db.query(
      `INSERT INTO hotels
         (name, city, country, price_per_night, x_longitude, y_latitude,
          amenities, hotel_image_url, discount_percentage)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING *`,
      [
        name,
        city,
        country,
        pricePerNight,
        x_longitude,
        y_latitude,
        amenities,
        hotel_image_url,
        discount_percentage
      ]
    );
    return rows[0];
  },

  // 2) Tüm otelleri commentCount, averageRating ve memberPrice ile listeleme
  async listAll() {
    const { rows } = await db.query(
      `SELECT
         h.*,
         COALESCE(AVG(c.rating),0)::numeric(3,2)                        AS "averageRating",
         COUNT(c.*)::int                                               AS "commentCount",
         ROUND(h.price_per_night * (1 - h.discount_percentage/100),2)::numeric(10,2) AS "memberPrice"
       FROM hotels h
       LEFT JOIN comments c ON c.hotel_id = h.id
       GROUP BY h.id
       ORDER BY h.created_at DESC`
    );
    return rows;
  },

  // 3) Esnek filtrelerle müsait otelleri arama
  async searchAvailable(params) {
    const {
      city, country,
      minPrice, maxPrice,
      lat, lng, radius,
      amenities = [],
      startDate, endDate
    } = params;

    const where = [];
    const values = [];
    let idx = 1;

    if (city) {
      where.push(`h.city = $${idx++}`);
      values.push(city);
    }
    if (country) {
      where.push(`h.country = $${idx++}`);
      values.push(country);
    }
    if (minPrice != null) {
      where.push(`h.price_per_night >= $${idx++}`);
      values.push(minPrice);
    }
    if (maxPrice != null) {
      where.push(`h.price_per_night <= $${idx++}`);
      values.push(maxPrice);
    }

    // Tarih aralığında müsaitlik
    where.push(`NOT EXISTS (
      SELECT 1 FROM bookings b
       WHERE b.hotel_id = h.id
         AND NOT (b.end_date <= $${idx} OR b.start_date >= $${idx+1})
    )`);
    values.push(startDate, endDate);
    idx += 2;

    if (amenities.length) {
      where.push(`h.amenities @> $${idx++}`);
      values.push(amenities);
    }
    if (lat != null && lng != null && radius != null) {
      where.push(`
        (POWER(h.y_latitude - $${idx}, 2) + POWER(h.x_longitude - $${idx+1}, 2))
          <= POWER($${idx+2}/111, 2)
      `);
      values.push(lat, lng, radius);
      idx += 3;
    }

    const query = `
      SELECT
        h.*,
        COALESCE(AVG(c.rating),0)::numeric(3,2)                        AS "averageRating",
        COUNT(c.*)::int                                               AS "commentCount",
        ROUND(h.price_per_night * (1 - h.discount_percentage/100),2)::numeric(10,2) AS "memberPrice"
      FROM hotels h
      LEFT JOIN comments c ON c.hotel_id = h.id
      ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
      GROUP BY h.id
      ORDER BY h.discount_percentage DESC, h.point_value DESC
    `;
    const { rows } = await db.query(query, values);
    return rows;
  },

  // 4) Otel detay verisi (ham)
  async findById(id) {
    const { rows } = await db.query(
      `SELECT * FROM hotels WHERE id = $1`,
      [id]
    );
    return rows[0] || null;
  }
};

module.exports = Hotel;
