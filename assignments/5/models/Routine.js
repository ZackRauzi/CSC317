import pool from "../config/db.js";

//GET
export async function getAll() {
  const { rows } = await pool.query(
    "SELECT * FROM workout_routines ORDER BY id ASC"
  );
  return rows;
}
export async function getById(id) {
  const { rows } = await pool.query(
    "SELECT * FROM workout_routines WHERE id = $1",
    [id]
  );
  return rows[0] || null;
}

//CREATE
export async function create({ name }) {
  const { rows } = await pool.query(
    "INSERT INTO workout_routines (name) VALUES ($1) RETURNING *",
    [name]
  );
  return rows[0];
}

//UPDATE
export async function update(id, { name }) {
  const { rows } = await pool.query(
    `UPDATE workout_routines 
     SET name = $1
     WHERE id = $2
     RETURNING *`,
    [name, id]
  );
  return rows[0] || null;
}

//DELETE
export async function remove(id) {
  await pool.query("DELETE FROM workout_routines WHERE id = $1", [id]);
}
