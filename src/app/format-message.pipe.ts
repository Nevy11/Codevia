import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'formatMessage',
  standalone: true,
})
export class FormatMessagePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string | null | undefined): SafeHtml {
    if (!value) return '';

    let formatted = value;

    formatted = formatted.replace(
      /```(?:[a-z]+)?\n([\s\S]*?)\n```/g,
      '<pre><code>$1</code></pre>',
    );

    formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');

    formatted = formatted.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    formatted = formatted.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    formatted = formatted.replace(/^# (.*$)/gm, '<h1>$1</h1>');

    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

    formatted = formatted.replace(/^\s*[\*\-]\s+(.*)$/gm, '• $1');

    formatted = formatted.replace(/\*([^*]+)\*/g, '<i>$1</i>');

    formatted = formatted.replace(/\n/g, '<br>');

    return this.sanitizer.bypassSecurityTrustHtml(formatted);
  }
}
