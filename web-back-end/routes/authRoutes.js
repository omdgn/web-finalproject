// routes/authRoutes.js
const router    = require('express').Router();
const jwt       = require('jsonwebtoken');
const passport  = require('../config/passport');
const upload    = require('../middlewares/uploadMiddleware');
const {
  register,
  login,
  profile,
  updatePhoto  // ekledik
} = require('../controllers/authController');
const { authenticate } = require('../middlewares/authMiddleware');

// Email/şifre ile kayıt
router.post('/register', register);

// Email/şifre ile giriş
router.post('/login', login);

// Profil bilgisi (token ile)
router.get('/me', authenticate, profile);

// Profil fotoğrafı güncelleme
router.post(
  '/me/photo',
  authenticate,
  upload.single('image'),
  updatePhoto
);

// Google OAuth başlat
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile','email'] })
);

// Google callback
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/auth/login' }),
  (req, res) => {
    const token = jwt.sign(
      { userId: req.user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    // JSON dönmek istersen:
    // res.json({ user: req.user, token });
    // Veya front-end’e redirect:
    res.redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${token}`);
  }
);

module.exports = router;
