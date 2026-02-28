import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'formatMessage',
  standalone: true
})
export class FormatMessagePipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string | null | undefined): SafeHtml {
    if (!value) return '';

    let formatted = value;

    // 1. Code Blocks: ```language ... ``` -> <pre><code>...</code></pre>
    // This matches everything between the triple backticks
    formatted = formatted.replace(/```(?:[a-z]+)?\n([\s\S]*?)\n```/g, 
      '<pre><code>$1</code></pre>');

    // 2. Inline Code: `code` -> <code>code</code>
    // For shorter snippets like `torch.Tensor`
    formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');

    // 1. Headers: ### Text -> <h3>Text</h3>
    // This matches 1 to 3 hashes and wraps the text
    formatted = formatted.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    formatted = formatted.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    formatted = formatted.replace(/^# (.*$)/gm, '<h1>$1</h1>');

    // 2. Bold: **text** -> <b>text</b>
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

    // 3. Bullet Points: Replace "*" or "-" at the start of a line
    formatted = formatted.replace(/^\s*[\*\-]\s+(.*)$/gm, '• $1');

    // 4. Italics: *text* -> <i>text</i>
    formatted = formatted.replace(/\*([^*]+)\*/g, '<i>$1</i>');

    // 5. Handle new lines
    // We avoid double spacing if it's already a header
    formatted = formatted.replace(/\n/g, '<br>');

    return this.sanitizer.bypassSecurityTrustHtml(formatted);
  }
}