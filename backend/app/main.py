"""
Punto de entrada de la API GraphQL.
Configura Starlette con Ariadne y CORS para desarrollo.
"""
from ariadne import make_executable_schema
from ariadne.asgi import GraphQL
from starlette.applications import Starlette
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware
from starlette.routing import Route

from app.schema import type_defs
from app.resolvers import query, mutation

# Schema GraphQL ejecutable
schema = make_executable_schema(type_defs, query, mutation)
graphql_app = GraphQL(schema, debug=True)

# CORS permisivo para desarrollo local
middleware = [
    Middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["*"],
        allow_headers=["*"],
    )
]

# Aplicación ASGI
app = Starlette(
    debug=True,
    routes=[
        Route("/graphql", graphql_app.handle_request, methods=["GET", "POST", "OPTIONS"]),
    ],
    middleware=middleware,
)
