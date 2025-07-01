// config/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userModel');

const BASE_URL= "http://localhost:5050";

// Google Strategy tanımı
passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:  `${BASE_URL}/auth/google/callback`
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Google'dan dönen e-posta
      const email = profile.emails[0].value;
      let user = await User.findByEmail(email);

      if (!user) {
        // Henüz kullanıcı yoksa yeni kayıt
        user = await User.create({
          email,
          passwordHash: null,            // şifre yok
          name: profile.displayName,
          country: null,
          city: null,
          photo_url: profile.photos[0].value
        });
      }

      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }
));

// Passport serialize/deserialize (stateless kullanım için minimal)
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

module.exports = passport;
