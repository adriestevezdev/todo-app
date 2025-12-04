import { Component, output, input, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-edit-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-modal.component.html',
})
export class EditModalComponent {
  todo = input<Todo | null>(null);
  save = output<{ title: string; description: string }>();
  close = output<void>();

  title = '';
  description = '';

  constructor() {
    effect(() => {
      const todo = this.todo();
      if (todo) {
        this.title = todo.title;
        this.description = todo.description || '';
      }
    });
  }

  onSubmit(): void {
    if (this.title.trim()) {
      this.save.emit({ title: this.title.trim(), description: this.description.trim() });
    }
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.close.emit();
    }
  }
}
