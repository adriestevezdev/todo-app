import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Todo } from '../models/todo.model';

interface GraphQLResponse<T> {
  data: T;
}

/** Campos comunes del Todo para reutilizar en queries GraphQL */
const TODO_FIELDS = `id title description completed`;

/** Servicio para comunicación con la API GraphQL */
@Injectable({ providedIn: 'root' })
export class TodoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8000/graphql';

  getTodos(): Observable<Todo[]> {
    const query = `query { todos { ${TODO_FIELDS} } }`;
    return this.http
      .post<GraphQLResponse<{ todos: Todo[] }>>(this.apiUrl, { query })
      .pipe(map((res) => res.data.todos));
  }

  createTodo(title: string, description?: string): Observable<Todo> {
    const query = `
      mutation CreateTodo($title: String!, $description: String) {
        createTodo(title: $title, description: $description) { ${TODO_FIELDS} }
      }
    `;
    return this.http
      .post<GraphQLResponse<{ createTodo: Todo }>>(this.apiUrl, {
        query,
        variables: { title, description },
      })
      .pipe(map((res) => res.data.createTodo));
  }

  updateTodo(id: string, updates: Partial<Omit<Todo, 'id'>>): Observable<Todo> {
    const query = `
      mutation UpdateTodo($id: ID!, $title: String, $description: String, $completed: Boolean) {
        updateTodo(id: $id, title: $title, description: $description, completed: $completed) { ${TODO_FIELDS} }
      }
    `;
    return this.http
      .post<GraphQLResponse<{ updateTodo: Todo }>>(this.apiUrl, {
        query,
        variables: { id, ...updates },
      })
      .pipe(map((res) => res.data.updateTodo));
  }

  deleteTodo(id: string): Observable<boolean> {
    const query = `mutation DeleteTodo($id: ID!) { deleteTodo(id: $id) }`;
    return this.http
      .post<GraphQLResponse<{ deleteTodo: boolean }>>(this.apiUrl, {
        query,
        variables: { id },
      })
      .pipe(map((res) => res.data.deleteTodo));
  }
}
