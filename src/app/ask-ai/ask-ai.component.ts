import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'nevy11-ask-ai',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './ask-ai.component.html',
  styleUrl: './ask-ai.component.scss',
})
export class AskAiComponent {
  open = false;

  toggleChat() {
    this.open = !this.open;
  }
}
