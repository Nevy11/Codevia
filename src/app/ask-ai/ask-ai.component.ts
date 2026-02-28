import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { SupabaseClientService } from '../supabase-client.service';
import { AiResponseViewComponent } from './ai-response-view/ai-response-view.component';
import { ChatMessage } from './ai-response-view/chat-message';

@Component({
  selector: 'nevy11-ask-ai',
  imports: [MatIconModule,
     MatButtonModule, MatFormFieldModule,
    MatInputModule, ReactiveFormsModule,
     AiResponseViewComponent],
  templateUrl: './ask-ai.component.html',
  styleUrl: './ask-ai.component.scss',
})
export class AskAiComponent {
  supabase = inject(SupabaseClientService);
  open = false;
  cdr = inject(ChangeDetectorRef);
  ai_data = signal(
    {
      query: new FormControl("")
    }
  )
  messages = signal<ChatMessage[]>([]);
  isLoading = signal(false);
  toggleChat() {
    this.open = !this.open;
  }
  async submitQuestion(event: Event) {
    event.preventDefault();
    
    const queryValue = this.ai_data().query.value;
    console.log('User Prompt:', queryValue);

    // if (queryValue) {
    //   try {
    //     // 1. You might want to set a loading state here
    //     // this.isLoading = true; 

    //     const response = await this.supabase.generateAiResponse(queryValue);
        
    //     console.log('AI Response:', response);

    //     // 2. Assign the response to a variable to show in your HTML
    //     // this.aiResult = response;

    //   } catch (error) {
    //     console.error('Submission Error:', error);
    //   } finally {
    //     // this.isLoading = false;
    //   }
    // }
    if (queryValue && !this.isLoading()) {
      // 1. Add User message to list
      this.messages.update(prev => [...prev, { role: 'user', content: queryValue }]);
      this.ai_data().query.reset();
      this.isLoading.set(true);

      try {
        const response = await this.supabase.generateAiResponse(queryValue);
        
        // 2. Add AI response to list
        this.messages.update(prev => [...prev, { role: 'assistant', content: response }]);
      } catch (error) {
        console.error('Submission Error:', error);
      } finally {
        this.isLoading.set(false);
        this.cdr.detectChanges();
      }
    }
  }
}
