import { Component, input } from '@angular/core';
import { ChatMessage } from './chat-message';

@Component({
  selector: 'nevy11-ai-response-view',
  imports: [],
  templateUrl: './ai-response-view.component.html',
  styleUrl: './ai-response-view.component.scss',
})
export class AiResponseViewComponent {
  messages = input<ChatMessage[]>([]);
}
