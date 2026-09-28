const API = "http://localhost:3000/api/tareas";
const tasksEl = document.getElementById("tasks");
const filterEl = document.getElementById("filter");
const messageEl = document.getElementById("message");

async function loadTasks() {
  messageEl.textContent = "";
  const estado = filterEl.value;
  const url = estado ? `${API}?estado=${estado}` : API;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("No se pudieron consultar las tareas.");
    const tasks = await response.json();
    renderTasks(tasks);
    updateSummary();
  } catch (error) {
    messageEl.textContent = error.message + " Verifica que el backend esté ejecutándose.";
  }
}

function renderTasks(tasks) {
  tasksEl.innerHTML = "";
  if (!tasks.length) {
    tasksEl.innerHTML = '<div class="card">No hay tareas para mostrar.</div>';
    return;
  }

  tasks.forEach(task => {
    const completed = task.estado === "completada";
    const article = document.createElement("article");
    article.className = `task ${completed ? "completed" : ""}`;
    article.innerHTML = `
      <div class="task-left">
        <div class="task-icon">${completed ? "✓" : "!"}</div>
        <div>
          <h3>${escapeHtml(task.titulo)}</h3>
          <p>${escapeHtml(task.curso)}</p>
        </div>
      </div>
      <div class="deadline">
        <strong>Entrega: ${formatDate(task.fechaEntrega)}</strong>
        <span class="status">${completed ? "Completada" : "Pendiente"}</span>
        ${!completed ? `<button class="complete-btn" data-id="${task.id}">Completar</button>` : ""}
      </div>
    `;
    tasksEl.appendChild(article);
  });

  document.querySelectorAll(".complete-btn").forEach(btn => {
    btn.addEventListener("click", () => completeTask(btn.dataset.id));
  });
}

async function completeTask(id) {
  messageEl.textContent = "";
  try {
    const response = await fetch(`${API}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: "completada" })
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.mensaje || "No se pudo completar la tarea.");
    }
    await loadTasks();
  } catch (error) {
    messageEl.textContent = error.message;
  }
}

async function updateSummary() {
  try {
    const response = await fetch(API);
    const tasks = await response.json();
    const pending = tasks.filter(t => t.estado === "pendiente");
    const completed = tasks.filter(t => t.estado === "completada");
    document.getElementById("pendingCount").textContent = pending.length;
    document.getElementById("completedCount").textContent = completed.length;

    if (pending.length) {
      const dates = pending.map(t => t.fechaEntrega).sort();
      document.getElementById("nextDue").textContent = formatDate(dates[0]);
    } else {
      document.getElementById("nextDue").textContent = "—";
    }
  } catch (_) {}
}

function formatDate(value) {
  const [y,m,d] = value.split("-");
  return `${d}/${m}/${y}`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));
}

filterEl.addEventListener("change", loadTasks);
loadTasks();
