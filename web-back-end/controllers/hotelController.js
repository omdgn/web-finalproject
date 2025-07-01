// controllers/hotelController.js
const Hotel   = require('../models/hotelModel');
const Comment = require('../models/commentModel');
const geocode = require('../utils/geocode');

// 1) Yeni otel ekleme
exports.createHotel = async (req, res, next) => {
  try {
    const {
      name,
      city,
      country,
      pricePerNight,
      address,
      amenities,
      hotel_image_url,
      discount_percentage = 0
    } = req.body;

    if (
      !name ||
      !city ||
      !country ||
      !pricePerNight ||
      !address ||
      !Array.isArray(amenities)
    ) {
      return res.status(400).json({
        message:
          'name, city, country, pricePerNight, address ve amenities (dizi) gerekli.'
      });
    }

    const { lat, lng } = await geocode(address);
    const hotel = await Hotel.create({
      name,
      city,
      country,
      pricePerNight,
      x_longitude: lng,
      y_latitude: lat,
      amenities,
      hotel_image_url,
      discount_percentage
    });

    res.status(201).json(hotel);
  } catch (err) {
    next(err);
  }
};

// 2) Tüm otelleri listeleme
exports.listHotels = async (_req, res, next) => {
  try {
    const rows = await Hotel.listAll();
    const hotels = rows.map(h => {
      // JS’de memberPrice’ı doğru hesapla
      const basePrice = parseFloat(h.price_per_night);
      const discount  = h.discount_percentage / 100;
      const memberPrice = Number((basePrice * (1 - discount)).toFixed(2));

      return {
        ...h,
        averageRating: parseFloat(h.averageRating),
        commentCount:  parseInt(h.commentCount, 10),
        memberPrice
      };
    });
    res.json(hotels);
  } catch (err) {
    next(err);
  }
};

// 3) Otel detay: yorumlar, metrikler, distribution ve üye fiyatı
exports.getHotelById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const hotel = await Hotel.findById(id);
    if (!hotel) {
      return res.status(404).json({ message: 'Otel bulunamadı.' });
    }

    const comments = await Comment.findByHotel(id);
    const commentCount = comments.length;
    const averageRating =
      commentCount > 0
        ? comments.reduce((sum, c) => sum + c.rating, 0) / commentCount
        : 0;

    const distribution = { overall: Number(averageRating.toFixed(2)) };
    const memberPrice = Number(
      (hotel.price_per_night * (1 - hotel.discount_percentage / 100)).toFixed(2)
    );

    res.json({
      ...hotel,
      comments,
      commentCount,
      averageRating: Number(averageRating.toFixed(2)),
      distribution,
      memberPrice
    });
  } catch (err) {
    next(err);
  }
};


// 4) Esnek arama endpoint’i
exports.searchHotels = async (req, res, next) => {
  try {
    const {
      city, country,
      minPrice, maxPrice,
      lat, lng, radius,
      amenities,
      startDate, endDate
    } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        message: 'startDate ve endDate sorgu parametreleri gerekli.'
      });
    }

    const amenityList = amenities ? amenities.split(',') : [];

    const rows = await Hotel.searchAvailable({
      city,
      country,
      minPrice:  minPrice != null ? Number(minPrice) : undefined,
      maxPrice:  maxPrice != null ? Number(maxPrice) : undefined,
      lat:       lat      != null ? Number(lat)      : undefined,
      lng:       lng      != null ? Number(lng)      : undefined,
      radius:    radius   != null ? Number(radius)   : undefined,
      amenities: amenityList,
      startDate,
      endDate
    });

    const hotels = rows.map(h => {
      const basePrice = parseFloat(h.price_per_night);
      const discount  = h.discount_percentage / 100;
      const memberPrice = Number((basePrice * (1 - discount)).toFixed(2));

      return {
        ...h,
        averageRating: parseFloat(h.averageRating),
        commentCount:  parseInt(h.commentCount, 10),
        memberPrice
      };
    });

    res.json(hotels);
  } catch (err) {
    next(err);
  }
};

// 5) Gelecek hafta sonu için müsait oteller
exports.searchWeekend = async (req, res, next) => {
  try {
    const today = new Date();
    const day = today.getDay();
    const daysUntilFri = (5 - day + 7) % 7;
    const nextFri = new Date(today.getTime() + daysUntilFri * 86400000);
    const nextSun = new Date(nextFri.getTime() + 2 * 86400000);
    const city = req.query.city || req.user?.city;

    const rows = await Hotel.searchAvailable({
      city,
      startDate: nextFri.toISOString().slice(0, 10),
      endDate:   nextSun.toISOString().slice(0, 10)
    });

    const hotels = rows.map(h => ({
      ...h,
      averageRating: parseFloat(h.averageRating),
      commentCount:  parseInt(h.commentCount,  10),
      memberPrice:   parseFloat(h.memberPrice)
    }));

    res.json(hotels);
  } catch (err) {
    next(err);
  }
};
