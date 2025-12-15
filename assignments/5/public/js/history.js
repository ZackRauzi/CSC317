//TIMER
function formatDuration(interval) {
  if (!interval) return "N/A";

  const hrs = interval.hours || 0;
  const mins = interval.minutes || 0;
  const secs = Math.floor(interval.seconds || 0);

  let text = "";
  if (hrs > 0) text += `${hrs}h `;
  if (mins > 0) text += `${mins}m `;
  text += `${secs}s`;

  return text.trim();
}

//DISPLAY HISTORY
async function loadHistory() {
  const res = await fetch("/api/history");
  const json = await res.json();
  const history = json.data || [];

  const list = document.getElementById("historyList");
  list.innerHTML = "";

  history.forEach(entry => {
    const card = document.createElement("div");
    card.className = "p-4 bg-slate-800 rounded-xl shadow space-y-2 border border-slate-700";

    card.innerHTML = `
      <h3 class="text-xl font-bold">${entry.routine_name}</h3>

      <p class="text-slate-300 text-sm">
        <strong>Started:</strong> ${new Date(entry.start_time).toLocaleString()}
      </p>

      <p class="text-slate-300 text-sm">
        <strong>Finished:</strong> ${new Date(entry.end_time).toLocaleString()}
      </p>

      <p class="text-slate-300 text-sm">
        <strong>Duration:</strong> ${formatDuration(entry.duration)}
      </p>

      <button
        class="delete-btn bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white text-sm"
        data-id="${entry.id}">
        Delete
      </button>
    `;

    list.appendChild(card);
  });

  setupDeleteHandlers();
}

//DELETE
function setupDeleteHandlers() {
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;

      if (!confirm("Delete this workout from history?")) return;

      await fetch(`/api/history/${id}`, { method: "DELETE" });

      loadHistory();
    });
  });
}

loadHistory();
