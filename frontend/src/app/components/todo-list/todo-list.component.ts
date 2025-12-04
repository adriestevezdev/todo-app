import { Component, input, output } from '@angular/core';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [],
  templateUrl: './todo-list.component.html',
})
export class TodoListComponent {
  todos = input.required<Todo[]>();
  toggle = output<Todo>();
  edit = output<Todo>();
  delete = output<Todo>();

  onToggle(todo: Todo): void {
    this.toggle.emit(todo);
  }

  onEdit(todo: Todo): void {
    this.edit.emit(todo);
  }

  onDelete(todo: Todo): void {
    this.delete.emit(todo);
  }
}
