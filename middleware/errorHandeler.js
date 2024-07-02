const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  return res.status(err.statusCode).send(err.message);
};
module.exports = errorHandler;
