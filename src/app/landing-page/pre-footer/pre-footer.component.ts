import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'nevy11-pre-footer',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './pre-footer.component.html',
  styleUrl: './pre-footer.component.scss',
})
export class PreFooterComponent {}
