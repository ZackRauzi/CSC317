//CATCH-ALL ERROR HANDLER
export default function errorHandler(err, req, res, next) {
  console.error("Error:", err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || "500 | Internal server error"
  });
}