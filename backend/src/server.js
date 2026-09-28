const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let tareas = [
  {
    id: 1,
    titulo: "Realizar contrato de API",
    curso: "Ingeniería de Software",
    fechaEntrega: "2026-09-30",
    estado: "pendiente"
  },
  {
    id: 2,
    titulo: "Investigación de bases de datos",
    curso: "Base de Datos II",
    fechaEntrega: "2026-10-02",
    estado: "pendiente"
  },
  {
    id: 3,
    titulo: "Ejercicio de integrales",
    curso: "Cálculo II",
    fechaEntrega: "2026-09-25",
    estado: "completada"
  },
  {
    id: 4,
    titulo: "Diagrama de infraestructura",
    curso: "Arquitectura de Software",
    fechaEntrega: "2026-10-05",
    estado: "pendiente"
  }
];

function validarEstado(estado) {
  return estado === "pendiente" || estado === "completada";
}

// GET /api/tareas
// GET /api/tareas?estado=pendiente
app.get("/api/tareas", (req, res) => {
  const { estado } = req.query;

  if (estado !== undefined && !validarEstado(estado)) {
    return res.status(400).json({
      error: "Estado inválido",
      mensaje: "El estado debe ser 'pendiente' o 'completada'."
    });
  }

  const resultado = estado
    ? tareas.filter(tarea => tarea.estado === estado)
    : tareas;

  res.status(200).json(resultado);
});

// GET /api/tareas/:id
app.get("/api/tareas/:id", (req, res) => {
  const id = Number(req.params.id);
  const tarea = tareas.find(t => t.id === id);

  if (!tarea) {
    return res.status(404).json({
      error: "Tarea no encontrada",
      mensaje: `No existe una tarea con el id ${req.params.id}.`
    });
  }

  res.status(200).json(tarea);
});

// PATCH /api/tareas/:id
app.patch("/api/tareas/:id", (req, res) => {
  const id = Number(req.params.id);
  const tarea = tareas.find(t => t.id === id);

  if (!tarea) {
    return res.status(404).json({
      error: "Tarea no encontrada",
      mensaje: `No existe una tarea con el id ${req.params.id}.`
    });
  }

  const { estado } = req.body;

  if (estado !== "completada") {
    return res.status(400).json({
      error: "Estado inválido",
      mensaje: "Para completar una tarea, el estado debe ser 'completada'."
    });
  }

  tarea.estado = "completada";
  res.status(200).json(tarea);
});

app.listen(PORT, () => {
  console.log(`API ejecutándose en http://localhost:${PORT}`);
});
