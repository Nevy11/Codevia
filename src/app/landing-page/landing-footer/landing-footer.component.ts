import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { match } from 'assert';
import { map } from 'rxjs';

@Component({
  selector: 'nevy11-landing-footer',
  imports: [MatIconModule, MatToolbarModule, MatButtonModule, AsyncPipe],
  templateUrl: './landing-footer.component.html',
  styleUrl: './landing-footer.component.scss',
})
export class LandingFooterComponent {
  private breakpointObserver = inject(BreakpointObserver);
  openLink(url: string) {
    window.open(url, '_blank');
  }
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map((matches) => {
      if (matches) {
        return [{ mobile_device: true }];
      }
      return [{ mobile_device: false }];
    })
  );
}
