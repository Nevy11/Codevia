import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'nevy11-terminal',
  imports: [MatIconModule, MatProgressSpinnerModule],
  templateUrl: './terminal.component.html',
  styleUrl: './terminal.component.scss',
})
export class TerminalComponent {
  @Input() logs: string[] = [];
  @Input() isLoading: boolean = false;
}
