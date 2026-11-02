const notFound = (req, res, _next) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};

const errorHandler = (err, _req, res, _next) => {
  console.error(err);
  const status = err.statusCode || (err.name === "ValidationError" ? 400 : 500);
  res.status(status).json({ message: err.message || "Server error" });
};

module.exports = { notFound, errorHandler };
