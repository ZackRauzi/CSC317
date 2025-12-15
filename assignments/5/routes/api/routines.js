import { Router } from "express";
import pool from "../../config/db.js";

const router = Router();

//GET ALL
router.get("/", async (req, res, next) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        r.id,
        r.name,
        COALESCE(
          json_agg(
            json_build_object(
              'exercise_id', e.id,
              'name', e.name,
              'sets', re.sets,
              'reps', re.reps
            )
          ) FILTER (WHERE e.id IS NOT NULL),
          '[]'
        ) AS exercises
      FROM workout_routines r
      LEFT JOIN routine_exercises re ON re.routine_id = r.id
      LEFT JOIN exercises e ON e.id = re.exercise_id
      GROUP BY r.id
      ORDER BY r.id DESC;
    `);

    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
});

//GET ONE
router.get("/:id", async (req, res, next) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        r.id,
        r.name,
        COALESCE(
          json_agg(
            json_build_object(
              'exercise_id', e.id,
              'name', e.name,
              'sets', re.sets,
              'reps', re.reps
            )
          ) FILTER (WHERE e.id IS NOT NULL),
          '[]'
        ) AS exercises
      FROM workout_routines r
      LEFT JOIN routine_exercises re ON re.routine_id = r.id
      LEFT JOIN exercises e ON e.id = re.exercise_id
      WHERE r.id = $1
      GROUP BY r.id;
    `, [req.params.id]);

    res.json({ success: true, data: rows[0] || null });
  } catch (err) {
    next(err);
  }
});

//CREATE
router.post("/", async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Routine name is required."
      });
    }

    const { rows } = await pool.query(
      `INSERT INTO workout_routines (name)
       VALUES ($1)
       RETURNING *;`,
      [name.trim()]
    );

    res.status(201).json({ success: true, data: rows[0] });

  } catch (err) {
    next(err);
  }
});

//ADD EXERCISE TO ROUTINE
router.post("/:routine_id/exercises", async (req, res, next) => {
  try {
    const { sets, reps, exercise_id } = req.body;
    const routineId = req.params.routine_id;

    const { rows } = await pool.query(
      `INSERT INTO routine_exercises (routine_id, exercise_id, sets, reps)
       VALUES ($1, $2, $3, $4)
       RETURNING *;`,
      [routineId, exercise_id, sets, reps]
    );

    res.status(201).json({ success: true, data: rows[0] });

  } catch (err) {
    next(err);
  }
});

export default router;
