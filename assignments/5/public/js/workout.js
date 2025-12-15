let currentRoutine = null;
let workoutStartTime = null;
let workoutTimerInterval = null;


//LOAD ROUTINES
async function loadRoutinesForSelect() {
  try {
    const res = await fetch("/api/routines");
    const json = await res.json();
    const routines = json.data || [];

    const select = document.getElementById("routineSelect");
    select.innerHTML = `<option value="">Select a routine...</option>`;

    routines.forEach(r => {
      const opt = document.createElement("option");
      opt.value = r.id;
      opt.textContent = r.name;
      select.appendChild(opt);
    });
  } catch (err) {
    console.error("Error loading routines:", err);
  }
}

//WORKOUT TRACKER
document.getElementById("startWorkoutBtn").addEventListener("click", async () => {
  const routineId = document.getElementById("routineSelect").value;

  if (!routineId) {
    alert("Please select a routine.");
    return;
  }

  try {
    const res = await fetch(`/api/routines/${routineId}`);
    const json = await res.json();
    const routine = json.data;

    if (!routine) {
      alert("Could not load routine.");
      return;
    }

    currentRoutine = routine;

    document.getElementById("routineSelectContainer").classList.add("hidden");

    const tracker = document.getElementById("workoutContainer");
    tracker.classList.remove("hidden");

    document.getElementById("workoutRoutineName").textContent = routine.name;

    workoutStartTime = Date.now();
    startWorkoutTimer();

    renderExerciseList(routine);

  } catch (err) {
    console.error("Error loading routine:", err);
    alert("Error loading routine.");
  }
});

function renderExerciseList(routine) {
  const list = document.getElementById("exerciseList");
  list.innerHTML = "";

  (routine.exercises || []).forEach((ex, index) => {
    const row = document.createElement("div");
    row.className = "bg-slate-700 p-4 rounded-xl shadow flex items-start gap-3";

    row.innerHTML = `
      <input type="checkbox"
             class="exercise-check w-5 h-5 mt-1 accent-indigo-500"
             data-index="${index}" />

      <div class="flex-1">
        <h3 class="text-xl font-semibold">${ex.name}</h3>
        <p class="text-slate-300 text-sm">${ex.sets} sets × ${ex.reps} reps</p>
      </div>
    `;

    list.appendChild(row);
  });
}


//TIMER
function startWorkoutTimer() {
  const display = document.getElementById("workoutTimer");
  if (workoutTimerInterval) clearInterval(workoutTimerInterval);

  workoutTimerInterval = setInterval(() => {
    const elapsedMs = Date.now() - workoutStartTime;
    const totalSeconds = Math.floor(elapsedMs / 1000);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;

    display.textContent = `${m}m ${s.toString().padStart(2, "0")}s`;
  }, 1000);
}

function stopWorkoutTimer() {
  if (workoutTimerInterval) {
    clearInterval(workoutTimerInterval);
    workoutTimerInterval = null;
  }
}


//SAVE WORKOUT
document.getElementById("finishWorkoutBtn").addEventListener("click", async () => {
  if (!currentRoutine) {
    alert("No workout in progress.");
    return;
  }

  stopWorkoutTimer();

  const elapsedMs = Date.now() - workoutStartTime;
  const durationSeconds = Math.floor(elapsedMs / 1000);

  try {
    await fetch("/api/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        routine_id: currentRoutine.id,
        duration_seconds: durationSeconds,
        notes: "Workout completed."
      })
    });

    alert("Workout saved to history!");

    document.getElementById("workoutContainer").classList.add("hidden");
    document.getElementById("routineSelectContainer").classList.remove("hidden");

    document.getElementById("workoutTimer").textContent = "0m 00s";
    document.getElementById("exerciseList").innerHTML = "";

    currentRoutine = null;
    workoutStartTime = null;

  } catch (err) {
    console.error("Error saving workout history:", err);
    alert("Error saving workout history.");
  }
});

loadRoutinesForSelect();
