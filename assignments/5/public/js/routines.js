//LOAD EXERCISES
async function loadExercisesForSelect() {
  const res = await fetch("/api/exercises");
  const json = await res.json();
  const exercises = json.data;

  const select = document.getElementById("exerciseSelect");

  exercises.forEach(ex => {
    const opt = document.createElement("option");
    opt.value = ex.id;
    opt.textContent = ex.name;
    select.appendChild(opt);
  });
}


//CREATE ROUTINE
let tempExercises = [];

document.getElementById("addExerciseBtn").addEventListener("click", () => {
  const exerciseId = document.getElementById("exerciseSelect").value;
  const sets = document.getElementById("exerciseSets").value;
  const reps = document.getElementById("exerciseReps").value;

  if (!exerciseId) return alert("Please select an exercise.");
  if (!sets || sets < 1) return alert("Sets must be a positive number.");
  if (!reps || reps < 1) return alert("Reps must be a positive number.");

  tempExercises.push({
    exercise_id: Number(exerciseId),
    sets: Number(sets),
    reps: Number(reps)
  });

  renderTempExerciseList();

  document.getElementById("exerciseSelect").value = "";
  document.getElementById("exerciseSets").value = "";
  document.getElementById("exerciseReps").value = "";
});

function renderTempExerciseList() {
  const list = document.getElementById("tempExerciseList");
  list.innerHTML = "";

  tempExercises.forEach((ex, index) => {
    const li = document.createElement("li");
    li.className = "bg-slate-700 p-2 rounded flex justify-between items-center";

    li.innerHTML = `
      <span>Exercise ID: ${ex.exercise_id} — ${ex.sets} sets × ${ex.reps} reps</span>
      <button class="text-red-400 hover:text-red-300" data-index="${index}">Remove</button>
    `;

    list.appendChild(li);
  });

  document.querySelectorAll("#tempExerciseList button").forEach(btn => {
    btn.addEventListener("click", () => {
      tempExercises.splice(btn.dataset.index, 1);
      renderTempExerciseList();
    });
  });
}


//SAVE ROUTINE
document.getElementById("saveRoutineBtn").addEventListener("click", async () => {
  const title = document.getElementById("routineTitle").value;

  if (!title.trim()) {
    alert("Routine Title is required.");
    return;
  }

  if (tempExercises.length === 0) {
    alert("Please add at least one exercise.");
    return;
  }

  const res = await fetch("/api/routines", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: title })
  });

  const json = await res.json();
  const routineId = json.data.id;

  for (const ex of tempExercises) {
    await fetch(`/api/routines/${routineId}/exercises`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ex)
    });
  }

  alert("Routine saved!");

  tempExercises = [];
  document.getElementById("routineTitle").value = "";
  renderTempExerciseList();

  loadRoutines();
});


//DISPLAY ROUTINES
async function loadRoutines() {
  const res = await fetch("/api/routines");
  const json = await res.json();
  const routines = json.data;

  const list = document.getElementById("routineList");
  list.innerHTML = "";

  routines.forEach(routine => {
    const div = document.createElement("div");
    div.className = "p-4 bg-slate-700 rounded shadow space-y-2";

    let exercisesHTML = "";
    routine.exercises.forEach(ex => {
      exercisesHTML += `
        <p class="ml-4 text-slate-300">
          • ${ex.name}: ${ex.sets} sets × ${ex.reps} reps
        </p>
      `;
    });

    div.innerHTML = `
      <h3 class="text-xl font-semibold text-white">${routine.name}</h3>
      ${exercisesHTML}
    `;

    list.appendChild(div);
  });
}

loadExercisesForSelect();
loadRoutines();