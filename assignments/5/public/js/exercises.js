async function loadExercises(filters = {}) {
  const params = new URLSearchParams(filters);
  const res = await fetch(`/api/exercises?${params.toString()}`);
  const json = await res.json();
  const exercises = json.data;

  const list = document.getElementById("exerciseList");
  list.innerHTML = "";

  //DISPLAY EXERCISES
  exercises.forEach(ex => {
    const card = document.createElement("div");
    card.className = "p-4 bg-slate-800 border border-slate-700 rounded";

    card.innerHTML = `
      <h3 class="text-xl font-semibold">${ex.name}</h3>
      <p><strong>Type:</strong> ${ex.exercise_type || "-"}</p>
      <p><strong>Muscle Group:</strong> ${ex.muscle_group || "-"}</p>
      <p><strong>Equipment:</strong> ${ex.equipment_name || "-"}</p>
      <p><strong>Notes:</strong> ${ex.notes || "-"}</p>

      <button data-id="${ex.id}"
        class="update-btn bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white mt-3">
        Update
      </button>

      <button data-id="${ex.id}"
        class="delete-btn bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white mt-3 ml-2">
        Delete
      </button>
    `;

    list.appendChild(card);
  });

  attachUpdateHandlers();
  attachDeleteHandlers();
}


//CREATE EXERCISE
document.getElementById("exerciseForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = Object.fromEntries(new FormData(e.target));

  //VALIDATION
  if (!data.name || typeof data.name !== "string" || data.name.trim() === "") {
    alert("Exercise Name is required.");
    return;
  }
  if (!data.exerciseType || data.exerciseType.trim() === "") {
    alert("Please select an exercise type.");
    return;
  }
  if (data.muscleGroup && typeof data.muscleGroup !== "string") {
    alert("Muscle Group must be text.");
    return;
  }
  if (data.equipmentName && typeof data.equipmentName !== "string") {
    alert("Equipment Name must be text.");
    return;
  }
  if (data.notes && typeof data.notes !== "string") {
    alert("Notes must be text.");
    return;
  }
  const res = await fetch("/api/exercises", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    const msg = await res.text();
    alert("Error saving exercise:\n" + msg);
    return;
  }

  e.target.reset();
  loadExercises();
});


//FILTER
document.getElementById("applyFilters").addEventListener("click", () => {
  const exerciseType = document.getElementById("filterType").value;
  loadExercises({ exerciseType });
});


//UPDATE POPUP
let currentEditId = null;

function attachUpdateHandlers() {
  document.querySelectorAll(".update-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      currentEditId = id;

      const res = await fetch(`/api/exercises/${id}`);
      const { data: ex } = await res.json();

      document.getElementById("editName").value = ex.name;
      document.getElementById("editType").value = ex.exercise_type || "";
      document.getElementById("editGroup").value = ex.muscle_group || "";
      document.getElementById("editEquipment").value = ex.equipment_name || "";
      document.getElementById("editNotes").value = ex.notes || "";

      document.getElementById("editModal").classList.remove("hidden");
      document.getElementById("editModal").classList.add("flex");
    });
  });
}

document.getElementById("saveEdit").addEventListener("click", async () => {

  const body = {
    name: document.getElementById("editName").value,
    exerciseType: document.getElementById("editType").value,
    muscleGroup: document.getElementById("editGroup").value,
    equipmentName: document.getElementById("editEquipment").value,
    notes: document.getElementById("editNotes").value
  };

  if (!body.name.trim()) return alert("Exercise Name is required.");
  if (!body.exerciseType.trim()) return alert("Exercise Type is required.");

  await fetch(`/api/exercises/${currentEditId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  closeModal();
  loadExercises();
});


//CANCEL BUTTON
document.getElementById("cancelEdit").addEventListener("click", closeModal);

function closeModal() {
  const modal = document.getElementById("editModal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}


// DELETE
function attachDeleteHandlers() {
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;

      if (!confirm("Delete this exercise?")) return;

      await fetch(`/api/exercises/${id}`, {
        method: "DELETE"
      });

      loadExercises();
    });
  });
}

loadExercises();