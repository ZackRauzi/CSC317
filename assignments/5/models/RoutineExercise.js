import pool from "../config/db.js";

//ADD
export async function addExerciseToRoutine({
  routine_id,
  exercise_id,
  sets,
  reps
}) {
  const { rows } = await pool.query(
    `INSERT INTO routine_exercises (routine_id, exercise_id, sets, reps)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [routine_id, exercise_id, sets, reps]
  );
  return rows[0];
}

//GET
export async function getExercisesForRoutine(routine_id) {
  const { rows } = await pool.query(
    `SELECT e.*, re.sets, re.reps
       FROM routine_exercises re
       JOIN exercises e ON e.id = re.exercise_id
      WHERE re.routine_id = $1
      ORDER BY e.name ASC`,
    [routine_id]
  );
  return rows;
}

//REMOVE
export async function removeExerciseFromRoutine(routine_id, exercise_id) {
  await pool.query(
    `DELETE FROM routine_exercises 
       WHERE routine_id = $1 AND exercise_id = $2`,
    [routine_id, exercise_id]
  );
}
