import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './todo-form.component.html',
})
export class TodoFormComponent {
  save = output<{ title: string; description: string }>();

  title = '';
  description = '';

  onSubmit(): void {
    if (this.title.trim()) {
      this.save.emit({ title: this.title.trim(), description: this.description.trim() });
      this.title = '';
      this.description = '';
    }
  }
}
