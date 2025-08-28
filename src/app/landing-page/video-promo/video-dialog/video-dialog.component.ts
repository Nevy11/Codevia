import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { SafeUrlPipe } from './safe-url.pipe';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'nevy11-video-dialog',
  imports: [MatButtonModule, SafeUrlPipe, FormsModule, MatSnackBarModule],
  templateUrl: './video-dialog.component.html',
  styleUrl: './video-dialog.component.scss',
  standalone: true,
})
export class VideoDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { url: string; language: string; code: string },
    private snackBar: MatSnackBar,
    private router: Router,
    private dialogRef: MatDialogRef<VideoDialogComponent>,
    private dialog: MatDialog
  ) {}
  ctaVisible = false;
  async ngOnInit() {
    // Show the CTA after 5 seconds
    setTimeout(() => {
      this.ctaVisible = true;
    }, 5000);

    // Start loading Pyodide but don't block UI
  }

  signUp() {
    try {
      this.dialog.closeAll();
    } catch (e) {
      console.error('Error while closing dialogs', e);
    }
    this.router.navigate(['signup']);
  }
}
