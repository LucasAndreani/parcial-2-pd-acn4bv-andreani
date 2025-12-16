# Gestor de Tareas

Aplicación desarrollada con Express y React para gestionar tareas con autenticación de usuarios y persistencia en SQLite.  
Cada usuario puede registrarse, iniciar sesión y administrar (editar, subir, eliminar) únicamente sus propias tareas.

## Tecnologías
- Backend: Node.js, Express, SQLite (better-sqlite3)
- Frontend: React, React Router, React Bootstrap
- Autenticación: JWT

## Funcionamiento
- Los usuarios se registran o inician sesión.
- El backend genera un token JWT que el frontend guarda en `localStorage`.
- Todas las rutas de tareas están protegidas mediante middleware de autenticación.
- Cada tarea está asociada a un usuario (`user_id`).
- El backend filtra las tareas por el usuario autenticado, impidiendo el acceso a tareas de otros usuarios.

## Endpoints
- `POST /auth/register` Registro de usuario
- `POST /auth/login` Login de usuario
- `GET /tasks` Obtener tareas del usuario autenticado
- `GET /tasks/:id` Obtener detalle de una tarea del usuario
- `POST /tasks` Crear tarea
- `PUT /tasks/:id` Editar tarea
- `DELETE /tasks/:id` Eliminar tarea

## Base de Datos
Se utiliza SQLite con dos tablas:
- `users`: almacena usuarios con email y contraseña encriptada.
- `tasks`: almacena tareas asociadas a un usuario.

## Ejecución
Backend:
```bash
cd backend
npm install
npm start
```
Frontend:
```bash
cd frontend
npm install
npm run dev
