// middlewares/errorMiddleware.js

exports.errorMiddleware = (err, _req, res, _next) => {
  console.error(err);
  const status = err.status || 500;
  const message = err.message || 'Sunucu hatası.';
  res.status(status).json({ message });
};
