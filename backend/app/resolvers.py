"""
Resolvers GraphQL para operaciones CRUD de tareas.
"""
from ariadne import QueryType, MutationType
from bson import ObjectId
from pymongo import ReturnDocument

from app.database import todos_collection

query = QueryType()
mutation = MutationType()


def serialize_todo(todo: dict) -> dict:
    """Convierte un documento MongoDB a formato GraphQL."""
    return {
        "id": str(todo["_id"]),
        "title": todo["title"],
        "description": todo.get("description"),
        "completed": todo.get("completed", False),
    }


# === QUERIES ===

@query.field("todos")
async def resolve_todos(*_):
    """Obtiene todas las tareas."""
    todos = []
    async for todo in todos_collection.find():
        todos.append(serialize_todo(todo))
    return todos


@query.field("todo")
async def resolve_todo(*_, id):
    """Obtiene una tarea por ID."""
    try:
        todo = await todos_collection.find_one({"_id": ObjectId(id)})
        if todo:
            return serialize_todo(todo)
    except Exception:
        pass
    return None


# === MUTATIONS ===

@mutation.field("createTodo")
async def resolve_create_todo(*_, title, description=None):
    """Crea una nueva tarea."""
    todo_data = {
        "title": title,
        "description": description,
        "completed": False,
    }
    result = await todos_collection.insert_one(todo_data)
    todo_data["_id"] = result.inserted_id
    return serialize_todo(todo_data)


@mutation.field("updateTodo")
async def resolve_update_todo(*_, id, title=None, description=None, completed=None):
    """Actualiza una tarea existente (campos parciales)."""
    try:
        update_data = {}
        if title is not None:
            update_data["title"] = title
        if description is not None:
            update_data["description"] = description
        if completed is not None:
            update_data["completed"] = completed

        if not update_data:
            return None

        result = await todos_collection.find_one_and_update(
            {"_id": ObjectId(id)},
            {"$set": update_data},
            return_document=ReturnDocument.AFTER,
        )
        if result:
            return serialize_todo(result)
    except Exception:
        pass
    return None


@mutation.field("deleteTodo")
async def resolve_delete_todo(*_, id):
    """Elimina una tarea por ID."""
    try:
        result = await todos_collection.delete_one({"_id": ObjectId(id)})
        return result.deleted_count > 0
    except Exception:
        return False
