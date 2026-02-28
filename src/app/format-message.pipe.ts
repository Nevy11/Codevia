import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'formatMessage',
})
export class FormatMessagePipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    if (!value) return '';

    // 1. Replace **text** with <b>text</b>
    let formatted = value.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

    // 2. Replace *text* with <i>text</i>
    formatted = formatted.replace(/\*(.*?)\*/g, '<i>$1</i>');

    // 3. Handle new lines (convert \n to <br>)
    formatted = formatted.replace(/\n/g, '<br>');

    // 4. Tell Angular this HTML is safe to render
    return this.sanitizer.bypassSecurityTrustHtml(formatted);
  }

}
