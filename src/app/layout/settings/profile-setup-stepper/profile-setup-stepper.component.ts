import { Component, inject } from '@angular/core';
import { MobileStepperComponent } from './mobile-stepper/mobile-stepper.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs';
import { NonMobileStepperComponent } from './non-mobile-stepper/non-mobile-stepper.component';

@Component({
  selector: 'nevy11-profile-setup-stepper',
  imports: [MobileStepperComponent, NonMobileStepperComponent],
  templateUrl: './profile-setup-stepper.component.html',
  styleUrl: './profile-setup-stepper.component.scss',
})
export class ProfileSetupStepperComponent {
  private breakpointObserver = inject(BreakpointObserver);
  Ismobile$ = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map((result) => result.matches),
    shareReplay(1)
  );
}
