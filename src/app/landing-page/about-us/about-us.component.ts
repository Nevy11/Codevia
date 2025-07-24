import { Component } from '@angular/core';
import { PreFooterComponent } from '../pre-footer/pre-footer.component';
import { LandingFooterComponent } from '../landing-footer/landing-footer.component';
import { TopAboutComponent } from './top-about/top-about.component';

@Component({
  selector: 'nevy11-about-us',
  imports: [PreFooterComponent, LandingFooterComponent, TopAboutComponent],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss',
})
export class AboutUsComponent {}
