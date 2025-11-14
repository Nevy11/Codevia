import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarRef,
  SimpleSnackBar,
  MatSnackBarConfig,
} from '@angular/material/snack-bar';
import { SnackbarType } from './snackbar';

@Injectable({
  providedIn: 'root',
})
export class CustomSnackBarService {
  // Global condition: True means standard snackbars are suppressed
  private isSnackbarDisabled: boolean = false;

  // Configuration map for different message types
  private readonly configMap: Record<SnackbarType, MatSnackBarConfig> = {
    standard: { duration: 3000 },
    success: { duration: 3000, panelClass: ['snackbar-success'] },
    error: { duration: 5000, panelClass: ['snackbar-error'] }, // Longer duration and error class
    info: { duration: 4000, panelClass: ['snackbar-info'] },
  };

  constructor(private snackBar: MatSnackBar) {}

  /**
   * Toggles the global state for disabling standard snackbars.
   */
  public setIsDisabled(isDisabled: boolean): void {
    this.isSnackbarDisabled = isDisabled;
    if (isDisabled) {
      this.snackBar.dismiss();
    }
  }

  /**
   * Enhanced wrapper function for MatSnackBar.open()
   */
  open(
    message: string,
    action: string = 'Close', // Default action to 'Close' for errors
    type: SnackbarType = 'standard', // 💡 New Type Parameter
    customConfig?: MatSnackBarConfig
  ): MatSnackBarRef<SimpleSnackBar> | null {
    // 💡 Core Logic Modification:
    // If standard snackbars are disabled AND the type is NOT 'error', suppress it.
    // Error messages will still show even if the standard flag is set to true.
    if (this.isSnackbarDisabled && type !== 'error') {
      console.log(`Snackbar suppressed (Disabled setting): "${message}"`);
      return null;
    }

    // Combine base config for the type with any user-provided custom config
    const baseConfig = this.configMap[type] || this.configMap['standard'];
    const finalConfig: MatSnackBarConfig = {
      ...baseConfig,
      ...customConfig,
    };

    // If the type is 'error', ensure the action button is visible and use a longer duration
    if (type === 'error') {
      finalConfig.duration = finalConfig.duration || 5000;
      finalConfig.panelClass = [
        ...(finalConfig.panelClass || []),
        'snackbar-error',
      ];
    }

    return this.snackBar.open(message, action, finalConfig);
  }
}
