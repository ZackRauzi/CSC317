import pool from "../config/db.js";

//GET ALL
export async function getAll({ exerciseType, muscleGroup }) {
  let query = "SELECT * FROM exercises WHERE 1=1";
  const params = [];

  if (exerciseType) {
    params.push(exerciseType);
    query += ` AND exercise_type = $${params.length}`;
  }
  if (muscleGroup) {
    params.push(muscleGroup);
    query += ` AND muscle_group ILIKE '%' || $${params.length} || '%'`;
  }
  query += " ORDER BY id DESC";
  const { rows } = await pool.query(query, params);
  return rows;
}

//GET ONE
export async function getById(id) {
  const { rows } = await pool.query(
    "SELECT * FROM exercises WHERE id=$1",
    [id]
  );
  return rows[0];
}

//CREATE
export async function create({ name, exerciseType, muscleGroup, equipmentName, notes }) {
  const { rows } = await pool.query(
    `INSERT INTO exercises 
      (name, exercise_type, muscle_group, equipment_name, notes)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [name, exerciseType, muscleGroup, equipmentName, notes]
  );
  return rows[0];
}

//UPDATE
export async function update(id, { name, exerciseType, muscleGroup, equipmentName, notes }) {
  const { rows } = await pool.query(
    `UPDATE exercises
     SET name=$1, exercise_type=$2, muscle_group=$3, equipment_name=$4, notes=$5
     WHERE id=$6
     RETURNING *`,
    [name, exerciseType, muscleGroup, equipmentName, notes, id]
  );
  return rows[0];
}

// DELETE
export async function remove(id) {
  await pool.query("DELETE FROM exercises WHERE id=$1", [id]);
}