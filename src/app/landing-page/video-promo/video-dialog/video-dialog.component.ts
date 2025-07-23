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
import { loadPyodide, PyodideInterface } from 'pyodide';
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
    loadPyodide().then((py) => {
      this.pyodide = py;
      this.loading = false;
      this.snackBar.open('Pyodide loaded successfully', 'Close', {
        duration: 2000,
      });
      console.log('Pyodide loaded successfully');
    });
  }

  code: string = `print("Hello, World!")`;
  pyodide!: PyodideInterface;
  loading = false;

  async runCode() {
    try {
      this.snackBar.open(`Output: $(result)`, `Close`, {
        duration: 4000,
      });
    } catch (err: any) {
      this.snackBar.open(`Error: ${err.message}`, `Close`, {
        duration: 4000,
      });
    }
  }

  signUp() {
    console.log('Starting closing btns');
    try {
      this.dialog.closeAll();
      console.log('Dialogs closed');
    } catch (e) {
      console.error('Error while closing dialogs', e);
    }
    this.router.navigate(['signup']);
    console.log('Finished');
  }
}
