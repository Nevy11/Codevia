import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'nevy11-ask-ai',
  imports: [MatIconModule,
     MatButtonModule, MatFormFieldModule,
    MatInputModule, ReactiveFormsModule],
  templateUrl: './ask-ai.component.html',
  styleUrl: './ask-ai.component.scss',
})
export class AskAiComponent {
  open = false;
  ai_data = signal(
    {
      query: new FormControl("")
    }
  )

  toggleChat() {
    this.open = !this.open;
  }
}
