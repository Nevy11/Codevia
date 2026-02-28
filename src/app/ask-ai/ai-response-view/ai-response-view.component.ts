import { Component, input } from '@angular/core';
import { ChatMessage } from './chat-message';
import { FormatMessagePipe } from '../../format-message.pipe';

@Component({
  selector: 'nevy11-ai-response-view',
  imports: [FormatMessagePipe],
  templateUrl: './ai-response-view.component.html',
  styleUrl: './ai-response-view.component.scss',
})
export class AiResponseViewComponent {
  messages = input<ChatMessage[]>([]);
}
