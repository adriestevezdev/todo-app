from ariadne import QueryType, MutationType

query = QueryType()
mutation = MutationType()

# Los resolvers se implementarán en el siguiente paso
# Por ahora solo definimos los tipos base

@query.field("todos")
async def resolve_todos(*_):
    return []

@query.field("todo")
async def resolve_todo(*_, id):
    return None

@mutation.field("createTodo")
async def resolve_create_todo(*_, title, description=None):
    return {"id": "temp", "title": title, "description": description, "completed": False}

@mutation.field("updateTodo")
async def resolve_update_todo(*_, id, title=None, description=None, completed=None):
    return None

@mutation.field("deleteTodo")
async def resolve_delete_todo(*_, id):
    return False
