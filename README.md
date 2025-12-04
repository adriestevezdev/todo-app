# TODO App — Full Stack Angular + Python

Aplicación CRUD de gestión de tareas desarrollada como prueba técnica para TimeFor.

## Stack Tecnológico

| Capa | Tecnologías |
|------|-------------|
| **Frontend** | Angular 21, SCSS, Standalone Components |
| **Backend** | Python, Starlette, Ariadne (GraphQL), Uvicorn |
| **Base de datos** | MongoDB |
| **Infraestructura** | Docker, Docker Compose |

## Ejecución con Docker (Recomendado)

```bash
docker compose up --build
```

Esto levanta los tres servicios:
- **Frontend:** http://localhost:4200
- **Backend (GraphQL Playground):** http://localhost:8000
- **MongoDB:** localhost:27017

## Ejecución Manual

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm start
```

> Requiere MongoDB corriendo en `localhost:27017`

## Enfoque del Desarrollo

- **Arquitectura modular:** Componentes standalone reutilizables en Angular con separación clara de responsabilidades.
- **GraphQL tipado:** Schema-first con Ariadne, queries y mutations bien definidas.
- **UI minimalista:** Diseño limpio con SCSS custom, sin frameworks de componentes.
- **Contenedorización completa:** Los tres servicios (frontend, backend, MongoDB) orquestados con Docker Compose.

## Desafíos y Soluciones

| Desafío | Solución |
|---------|----------|
| Comunicación Angular-GraphQL | Servicio dedicado con HttpClient y observables tipados |
| Hot reload en Docker | Volúmenes montados para sincronizar cambios en tiempo real |
| Manejo de estados de UI | Formularios reactivos + modal dedicado para edición |

## Estructura del Proyecto

```
todo-app/
├── backend/
│   └── app/
│       ├── main.py          # Entrada de la aplicación
│       ├── schema.py        # Esquema GraphQL
│       └── resolvers.py     # Lógica de negocio
├── frontend/
│   └── src/app/
│       ├── components/      # Componentes standalone
│       └── services/        # Servicios GraphQL
└── docker-compose.yml
```
