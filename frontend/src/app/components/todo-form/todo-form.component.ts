import { Component, output, input, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './todo-form.component.html',
})
export class TodoFormComponent {
  todoToEdit = input<Todo | null>(null);
  save = output<{ title: string; description: string }>();
  cancel = output<void>();

  title = '';
  description = '';

  constructor() {
    effect(() => {
      const todo = this.todoToEdit();
      if (todo) {
        this.title = todo.title;
        this.description = todo.description || '';
      } else {
        this.title = '';
        this.description = '';
      }
    });
  }

  onSubmit(): void {
    if (this.title.trim()) {
      this.save.emit({ title: this.title.trim(), description: this.description.trim() });
      this.title = '';
      this.description = '';
    }
  }

  onCancel(): void {
    this.cancel.emit();
    this.title = '';
    this.description = '';
  }
}
