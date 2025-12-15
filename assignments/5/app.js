import express from "express";
const app = express();

import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import exercisesRouter from "./routes/api/exercises.js";
import routinesRouter from "./routes/api/routines.js";
import historyRouter from "./routes/api/history.js";

import logger from "./middleware/logger.js";
import errorHandler from "./middleware/errorHandler.js";

const PORT = process.env.PORT || 3000;
import dotenv from "dotenv";
dotenv.config();

//DEVTESTING
import pool from "./config/db.js";
pool.query("SELECT NOW()")
  .then(res => console.log("Neon Connected:", res.rows[0].now))
  .catch(err => console.error("DB ERROR:", err));


//MIDDLEWARE
app.use(logger);
app.use(express.json());

//STATIC FILE
app.use(express.static(path.join(__dirname, "public")));

//VIEWS
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});
app.get("/exercises", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "exercises.html"));
});
app.get("/routines", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "routines.html"));
});
app.get("/workout", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "workout.html"));
});
app.get("/history", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "history.html"));
});

//API
app.use("/api/exercises", exercisesRouter);
app.use("/api/routines", routinesRouter);
app.use("/api/history", historyRouter);

//ERROR HANDLER (keep at end of program)
//404 PAGE
app.use((req, res) => {
  console.log("404 handler reached!");
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});
//500 ERROR CATCH-ALL
app.use(errorHandler);

//DEV CONNECTION TEST
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);