import { Router } from "express";
import * as Exercise from "../../models/Exercise.js";

const router = Router();


//GET ALL
router.get("/", async (req, res, next) => {
  try {
    const { exerciseType, muscleGroup } = req.query;
    const exercises = await Exercise.getAll({ exerciseType, muscleGroup });
    res.json({ success: true, data: exercises });
  } catch (err) {
    next(err);
  }
});

//GET ONE
router.get("/:id", async (req, res, next) => {
  try {
    const ex = await Exercise.getById(req.params.id);
    res.json({ success: true, data: ex });
  } catch (err) {
    next(err);
  }
});


//CREATE
router.post("/", async (req, res, next) => {
  try {
    const { name, exerciseType, muscleGroup, equipmentName, notes } = req.body;

    //VALIDATION
    if (!name || typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({ success: false, message: "Exercise Name is required." });
    }
    if (!exerciseType || typeof exerciseType !== "string" || exerciseType.trim() === "") {
      return res.status(400).json({ success: false, message: "Exercise Type is required." });
    }
    if (!["strength", "stretch", "cardio", "misc"].includes(exerciseType)) {
      return res.status(400).json({ success: false, message: "Invalid Exercise Type." });
    }
    if (muscleGroup && typeof muscleGroup !== "string") {
      return res.status(400).json({ success: false, message: "Muscle Group must be a string." });
    }
    if (equipmentName && typeof equipmentName !== "string") {
      return res.status(400).json({ success: false, message: "Equipment Name must be a string." });
    }
    if (notes && typeof notes !== "string") {
      return res.status(400).json({ success: false, message: "Notes must be a string." });
    }

    const exercise = await Exercise.create(req.body);
    res.status(201).json({ success: true, data: exercise });

  } catch (err) {
    console.error("POST ERROR:", err);
    next(err);
  }
});


// UPDATE EXERCISE
router.put("/:id", async (req, res, next) => {
  try {
    const { name, exerciseType, muscleGroup, equipmentName, notes } = req.body;

    //VALIDATION
    if (!name || typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({ success: false, message: "Exercise Name is required." });
    }
    if (!exerciseType || typeof exerciseType !== "string") {
      return res.status(400).json({ success: false, message: "Exercise Type is required." });
    }
    if (!["strength", "stretch", "cardio", "misc"].includes(exerciseType)) {
      return res.status(400).json({ success: false, message: "Invalid Exercise Type." });
    }
    if (muscleGroup && typeof muscleGroup !== "string") {
      return res.status(400).json({ success: false, message: "Muscle Group must be a string." });
    }
    if (equipmentName && typeof equipmentName !== "string") {
      return res.status(400).json({ success: false, message: "Equipment must be a string." });
    }
    if (notes && typeof notes !== "string") {
      return res.status(400).json({ success: false, message: "Notes must be a string." });
    }

    const updated = await Exercise.update(req.params.id, req.body);
    res.json({ success: true, data: updated });

  } catch (err) {
    next(err);
  }
});


// DELETE EXERCISE
router.delete("/:id", async (req, res, next) => {
  try {
    await Exercise.remove(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});


export default router;