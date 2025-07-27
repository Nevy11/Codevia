import { Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { NotAvailablePageComponent } from './not-available-page/not-available-page.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AboutUsComponent } from './landing-page/about-us/about-us.component';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './layout/home/home.component';

export const routes: Routes = [
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'unavailable',
    component: NotAvailablePageComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },

  {
    path: 'about-us',
    component: AboutUsComponent,
  },
  {
    path: 'layout',
    component: LayoutComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
      },
    ],
  },
  {
    path: '',
    component: LandingPageComponent,
  },
  {
    path: '**',
    redirectTo: 'unavailable',
  },
];
