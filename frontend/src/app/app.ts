import { Component, inject, signal, OnInit } from '@angular/core';
import { TodoService } from './services/todo.service';
import { TodoFormComponent } from './components/todo-form/todo-form.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { Todo } from './models/todo.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TodoFormComponent, TodoListComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly todoService = inject(TodoService);

  todos = signal<Todo[]>([]);
  todoToEdit = signal<Todo | null>(null);

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.todoService.getTodos().subscribe({
      next: (todos) => this.todos.set(todos),
      error: (err) => console.error('Error loading todos:', err),
    });
  }

  onSave(data: { title: string; description: string }): void {
    const editing = this.todoToEdit();
    if (editing) {
      this.todoService.updateTodo(editing.id, data).subscribe({
        next: () => {
          this.loadTodos();
          this.todoToEdit.set(null);
        },
        error: (err) => console.error('Error updating todo:', err),
      });
    } else {
      this.todoService.createTodo(data.title, data.description || undefined).subscribe({
        next: () => this.loadTodos(),
        error: (err) => console.error('Error creating todo:', err),
      });
    }
  }

  onToggle(todo: Todo): void {
    this.todoService.updateTodo(todo.id, { completed: !todo.completed }).subscribe({
      next: () => this.loadTodos(),
      error: (err) => console.error('Error toggling todo:', err),
    });
  }

  onEdit(todo: Todo): void {
    this.todoToEdit.set(todo);
  }

  onCancelEdit(): void {
    this.todoToEdit.set(null);
  }

  onDelete(todo: Todo): void {
    this.todoService.deleteTodo(todo.id).subscribe({
      next: () => this.loadTodos(),
      error: (err) => console.error('Error deleting todo:', err),
    });
  }
}
