// controllers/commentController.js
const Comment = require('../models/commentModel');

exports.addComment = async (req, res, next) => {
  try {
    const { hotelId } = req.params;
    const { rating, text } = req.body;
    if (rating == null) {
      return res.status(400).json({ message: 'Rating gerekli.' });
    }
    const comment = await Comment.create({
      userId: req.user.userId,
      hotelId,
      rating,
      text
    });
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
};

exports.getComments = async (req, res, next) => {
  try {
    const { hotelId } = req.params;
    const comments = await Comment.findByHotel(hotelId);
    res.json(comments);
  } catch (err) {
    next(err);
  }
};
