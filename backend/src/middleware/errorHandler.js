// Centralized error handler to keep responses consistent
export const errorHandler = (err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err);

  const status = err.status || 500;
  const message = err.message || 'Internal server error';

  return res.status(status).json({
    message,
  });
};
