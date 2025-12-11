import { Component, inject } from '@angular/core';
import { MobileStepperComponent } from './mobile-stepper/mobile-stepper.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { NonMobileStepperComponent } from './non-mobile-stepper/non-mobile-stepper.component';

@Component({
  selector: 'nevy11-profile-setup-stepper',
  imports: [MobileStepperComponent, AsyncPipe, NonMobileStepperComponent],
  templateUrl: './profile-setup-stepper.component.html',
  styleUrl: './profile-setup-stepper.component.scss',
})
export class ProfileSetupStepperComponent {
  private breakpointObserver = inject(BreakpointObserver);
  Ismobile$ = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map((result) => result.matches),
    shareReplay(1)
  );
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          {
            mobile_device: true,
          },
        ];
      } else {
        // tablet potrait view
        const isTabletPotrait = this.breakpointObserver.isMatched(
          Breakpoints.TabletPortrait
        );
        if (isTabletPotrait) {
          return [
            {
              mobile_device: false,
            },
          ];
        } else {
          // small laptop view
          const isSmallLaptop = this.breakpointObserver.isMatched(
            '(min-width: 840px) and (max-width: 1366px)'
          );
          if (isSmallLaptop) {
            return [
              {
                mobile_device: false,
              },
            ];
          } else {
            return [
              {
                mobile_device: false,
              },
            ];
            // Large laptop view
          }
        }
      }
    })
  );
}
