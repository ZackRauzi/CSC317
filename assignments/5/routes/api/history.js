import { Router } from "express";
import pool from "../../config/db.js";

const router = Router();


//GET ALL
router.get("/", async (req, res, next) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        h.id,
        h.routine_id,
        r.name AS routine_name,
        h.start_time,
        h.end_time,
        h.duration
      FROM routine_history h
      JOIN workout_routines r ON r.id = h.routine_id
      ORDER BY h.start_time DESC;
    `);

    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
});


//CREATE
router.post("/", async (req, res, next) => {
  try {
    const { routine_id, duration_seconds, notes } = req.body;

    if (!routine_id || !duration_seconds) {
      return res.status(400).json({
        success: false,
        message: "routine_id and duration_seconds are required."
      });
    }

    const { rows } = await pool.query(`
      INSERT INTO routine_history (routine_id, start_time, end_time, duration, notes)
      VALUES (
        $1,
        NOW() - make_interval(secs => $2),
        NOW(),
        make_interval(secs => $2),
        $3
      )
      RETURNING *;
    `, [routine_id, duration_seconds, notes || null]);

    res.status(201).json({ success: true, data: rows[0] });

  } catch (err) {
    next(err);
  }
});


//DELETE
router.delete("/:id", async (req, res, next) => {
  try {
    await pool.query("DELETE FROM routine_history WHERE id = $1", [
      req.params.id,
    ]);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});


export default router;