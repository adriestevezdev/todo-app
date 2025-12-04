from ariadne import gql

type_defs = gql("""
    type Todo {
        id: ID!
        title: String!
        description: String
        completed: Boolean!
    }

    type Query {
        todos: [Todo!]!
        todo(id: ID!): Todo
    }

    type Mutation {
        createTodo(title: String!, description: String): Todo!
        updateTodo(id: ID!, title: String, description: String, completed: Boolean): Todo
        deleteTodo(id: ID!): Boolean!
    }
""")
