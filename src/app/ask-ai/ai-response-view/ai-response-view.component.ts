import { Component, effect, ElementRef, input, viewChild } from '@angular/core';
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
  scrollContainer = viewChild<ElementRef>('scrollMe');
  onstructor() {
    effect(() => {
      // Trigger whenever messages update
      if (this.messages().length) {
        setTimeout(() => this.scrollToBottom(), 100);
      }
    });
  }

  private scrollToBottom() {
    const el = this.scrollContainer()?.nativeElement;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }
  }
}
