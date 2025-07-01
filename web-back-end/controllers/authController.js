// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Şifre kuralları: en az 8 karakter, 1 rakam, 1 özel karakter
const PASSWORD_REGEX = /^(?=.*\d)(?=.*\W).{8,}$/;

// Yeni kullanıcı kaydı
exports.register = async (req, res, next) => {
  try {
    const { email, password, name, country, city, photo_url } = req.body;
    // Gerekli alanlar
    if (!email || !password || !name) {
      return res.status(400).json({
        message: 'Email, şifre ve isim gerekli.'
      });
    }
    // Şifre validasyonu
    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({
        message:
          'Şifre en az 8 karakter, 1 rakam ve 1 özel karakter içermelidir.'
      });
    }
    // Email zaten var mı?
    const existing = await User.findByEmail(email);
    if (existing) {
      return res.status(409).json({ message: 'Bu email zaten kayıtlı.' });
    }
    // Şifre hash
    const passwordHash = await bcrypt.hash(password, 10);
    // Kullanıcı oluştur
    const user = await User.create({
      email,
      passwordHash,
      name,
      country,
      city,
      photo_url
    });
    // Token üret
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });
    res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
};

// Kullanıcı girişi
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email ve şifre gerekli.' });
    }
    const user = await User.findByEmail(email);
    if (!user) {
      return res
        .status(401)
        .json({ message: 'Geçersiz email veya şifre.' });
    }
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res
        .status(401)
        .json({ message: 'Geçersiz email veya şifre.' });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });
    // Şifre alanını gizle
    const { password_hash, ...userData } = user;
    res.json({ user: userData, token });
  } catch (err) {
    next(err);
  }
};

// Authenticated kullanıcı profili
exports.profile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};


// Profil fotoğrafı güncelleme
exports.updatePhoto = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const photoUrl = `/uploads/${req.file.filename}`;
    const updatedUser = await User.updatePhoto(userId, photoUrl);
    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
};