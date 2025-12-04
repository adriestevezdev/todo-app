from ariadne import make_executable_schema
from ariadne.asgi import GraphQL
from starlette.applications import Starlette
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware
from starlette.routing import Route

from app.schema import type_defs
from app.resolvers import query, mutation

# Crear schema ejecutable
schema = make_executable_schema(type_defs, query, mutation)

# Crear app GraphQL
graphql_app = GraphQL(schema, debug=True)

# Configurar CORS para desarrollo
middleware = [
    Middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["*"],
        allow_headers=["*"],
    )
]

# Crear aplicación Starlette
app = Starlette(
    debug=True,
    routes=[
        Route("/graphql", graphql_app.handle_request, methods=["GET", "POST", "OPTIONS"]),
    ],
    middleware=middleware,
)
