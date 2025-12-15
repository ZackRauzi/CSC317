import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//500 CATCH-ALL ERROR HANDLER
export default function errorHandler500(err, req, res, next) {
  console.error("Error:", err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || "500 | Internal server error"
  });
}