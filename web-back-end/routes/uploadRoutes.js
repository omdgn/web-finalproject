// routes/uploadRoutes.js
const router = require('express').Router();
const upload = require('../middlewares/uploadMiddleware');
const fs = require('fs');

// single file under form-field 'image'
router.post('/image', upload.single('image'), (req, res) => {
  // return the public URL or relative path
  res.json({ url: `/uploads/${req.file.filename}` });
});

module.exports = router;
