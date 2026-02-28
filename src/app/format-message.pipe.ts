import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'formatMessage',
  standalone: true // Added standalone: true since you're using it in a standalone component
})
export class FormatMessagePipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string | null | undefined): SafeHtml {
    if (!value) return '';

    let formatted = value;

    // 1. Bold: **text** -> <b>text</b>
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

    // 2. Bullet Points: Replace "*" at the start of a line with a bullet symbol
    // The 'm' flag allows '^' to match the start of every line
    formatted = formatted.replace(/^\s*[\*\-]\s+(.*)$/gm, '• $1');

    // 3. Italics: *text* -> <i>text</i>
    // Using [^*] ensures we don't accidentally match bold markers or bullets
    formatted = formatted.replace(/\*([^*]+)\*/g, '<i>$1</i>');

    // 4. Handle new lines
    formatted = formatted.replace(/\n/g, '<br>');

    return this.sanitizer.bypassSecurityTrustHtml(formatted);
  }
}