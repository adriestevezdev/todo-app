import { Component, inject, signal, OnInit } from '@angular/core';
import { TodoService } from './services/todo.service';
import { TodoFormComponent } from './components/todo-form/todo-form.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { EditModalComponent } from './components/edit-modal/edit-modal.component';
import { Todo } from './models/todo.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TodoFormComponent, TodoListComponent, EditModalComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly todoService = inject(TodoService);

  /** Lista reactiva de tareas */
  todos = signal<Todo[]>([]);
  /** Tarea seleccionada para editar (null si no hay modal abierto) */
  todoToEdit = signal<Todo | null>(null);

  ngOnInit(): void {
    this.loadTodos();
  }

  /** Carga todas las tareas desde el backend */
  loadTodos(): void {
    this.todoService.getTodos().subscribe({
      next: (todos) => this.todos.set(todos),
      error: (err) => console.error('Error loading todos:', err),
    });
  }

  /** Crea una nueva tarea */
  onSave(data: { title: string; description: string }): void {
    this.todoService.createTodo(data.title, data.description || undefined).subscribe({
      next: () => this.loadTodos(),
      error: (err) => console.error('Error creating todo:', err),
    });
  }

  /** Guarda los cambios de una tarea editada */
  onSaveEdit(data: { title: string; description: string }): void {
    const editing = this.todoToEdit();
    if (editing) {
      this.todoService.updateTodo(editing.id, data).subscribe({
        next: () => {
          this.loadTodos();
          this.todoToEdit.set(null);
        },
        error: (err) => console.error('Error updating todo:', err),
      });
    }
  }

  /** Alterna el estado completado/pendiente de una tarea */
  onToggle(todo: Todo): void {
    this.todoService.updateTodo(todo.id, { completed: !todo.completed }).subscribe({
      next: () => this.loadTodos(),
      error: (err) => console.error('Error toggling todo:', err),
    });
  }

  /** Abre el modal de edición */
  onEdit(todo: Todo): void {
    this.todoToEdit.set(todo);
  }

  /** Cierra el modal de edición */
  onCancelEdit(): void {
    this.todoToEdit.set(null);
  }

  /** Elimina una tarea (con confirmación) */
  onDelete(todo: Todo): void {
    if (confirm(`¿Estás seguro de que quieres eliminar "${todo.title}"?`)) {
      this.todoService.deleteTodo(todo.id).subscribe({
        next: () => this.loadTodos(),
        error: (err) => console.error('Error deleting todo:', err),
      });
    }
  }
}
