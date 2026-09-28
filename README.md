# Panel principal del estudiante

Implementación de una propuesta de mejora para el panel principal de estudiantes.

## Objetivo

El panel prioriza la información que el estudiante necesita atender al entrar: tareas pendientes, próxima entrega y tareas que pueden marcarse como completadas.

## Contrato API

| Acción | Método HTTP | Endpoint |
|---|---|---|
| Consultar tareas | GET | `/api/tareas` |
| Consultar una tarea | GET | `/api/tareas/:id` |
| Filtrar por estado | GET | `/api/tareas?estado={estado}` |
| Completar tarea | PATCH | `/api/tareas/:id` |

Estados permitidos:

- `pendiente`
- `completada`

### Ejemplo de JSON 

```json
{
  "id": 1,
  "titulo": "Realizar contrato de API",
  "curso": "Ingeniería de Software",
  "fechaEntrega": "2026-09-30",
  "estado": "pendiente"
}
```

### Tarea no encontrada

HTTP `404 Not Found`

```json
{
  "error": "Tarea no encontrada",
  "mensaje": "No existe una tarea con el id 999."
}
```

### Breaking change

Renombrar un campo existente, por ejemplo cambiar `titulo` por `nombre`, rompería a los clientes que esperan recibir el campo `titulo`.

## Códigos HTTP

- `200 OK`: consulta o actualización correcta.
- `400 Bad Request`: estado inválido.
- `404 Not Found`: tarea inexistente.

## Ejecutar

### 1. Backend

Abrir una terminal:

```bash
cd backend
npm install
npm start
```

La API estará disponible en:

`http://localhost:3000`

### 2. Frontend

Con el backend ejecutándose, abrir `frontend/index.html` en el navegador.

Si el navegador bloquea el archivo local, usar una extensión como Live Server de VS Code y abrir `frontend/index.html`.

## Endpoints para probar

- `GET http://localhost:3000/api/tareas`
- `GET http://localhost:3000/api/tareas/1`
- `GET http://localhost:3000/api/tareas?estado=pendiente`
- `PATCH http://localhost:3000/api/tareas/1`

Body del PATCH:

```json
{
  "estado": "completada"
}
```
