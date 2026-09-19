# API de Registro de Calificaciones — Escuela

API REST desarrollada con Django y Django REST Framework que simula el registro de calificaciones de una escuela.

## 📋 Descripción

El sistema permite gestionar estudiantes, profesores, materias, cursos, periodos académicos, matrículas, evaluaciones y calificaciones, con todas sus relaciones conectadas entre sí.

## 🗂️ Modelos

| Modelo | Descripción |
|---|---|
| `Profesor` | Datos del docente |
| `Materia` | Asignatura, asociada a un profesor |
| `Curso` | Grupo o grado (ej: "10-A") |
| `Periodo` | Periodo académico (ej: "2026-2") |
| `Estudiante` | Datos del alumno |
| `Matricula` | Conecta a un Estudiante con un Curso en un Periodo |
| `Evaluacion` | Examen/quiz de una Materia en un Periodo, con su porcentaje |
| `Calificacion` | Nota de un Estudiante en una Evaluación |

## 🔗 Relaciones

- Un **Profesor** dicta una **Materia**.
- Un **Estudiante** se matricula (**Matricula**) en un **Curso** durante un **Periodo**.
- Una **Materia** tiene varias **Evaluaciones**.
- Una **Calificacion** conecta a un **Estudiante** con una **Evaluación** específica.

## ⚙️ Tecnologías

- Python 3
- Django
- Django REST Framework
- SQLite

## 🚀 Instalación

```bash
git clone https://github.com/Jackeline-IA/API-basica.git
cd calificaciones-api
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

## Backend

```bash
cd backend
python -m venv ../env
../env\Scripts\activate          # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```


## 📡 Endpoints

Todos disponibles bajo `/api/`:

| Endpoint | Descripción |
|---|---|
| `GET/POST /api/profesores/` | Listar / crear profesores |
| `GET/POST /api/materias/` | Listar / crear materias |
| `GET/POST /api/cursos/` | Listar / crear cursos |
| `GET/POST /api/periodos/` | Listar / crear periodos |
| `GET/POST /api/estudiantes/` | Listar / crear estudiantes |
| `GET/POST /api/matriculas/` | Listar / crear matrículas |
| `GET/POST /api/evaluaciones/` | Listar / crear evaluaciones |
| `GET/POST /api/calificaciones/` | Listar / crear calificaciones |

Cada endpoint también soporta `GET/PUT/PATCH/DELETE` en `/api/<recurso>/<id>/` para el detalle, actualización o eliminación de un registro específico.

## 🔐 Panel de administración

Accede en `/admin/` con el superusuario creado, para gestionar todos los modelos desde una interfaz visual.

## 👤 Autor

Desarrollado por Grupo 2 de Trabajo Presentes en el día 12/09/2026
