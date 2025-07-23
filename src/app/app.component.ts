import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'nevy11-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Codevia';
  play = false;

  constructor(private router: Router, private dialog: MatDialog) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.dialog.closeAll(); // Close dialogs on navigation
      }
    });
  }
}
