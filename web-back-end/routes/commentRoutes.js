// routes/commentRoutes.js
const router = require('express').Router();
const { addComment, getComments } = require('../controllers/commentController');
const { authenticate } = require('../middlewares/authMiddleware');

router.post('/:hotelId', authenticate, addComment);
router.get('/:hotelId', getComments);

module.exports = router;
