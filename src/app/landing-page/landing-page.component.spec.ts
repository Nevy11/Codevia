import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { LandingPageComponent } from './landing-page.component';

const mockRouter = {
  navigate: jasmine.createSpy('navigate'),
  navigateByUrl: jasmine.createSpy('navigateByUrl'),
};

describe('LandingPageComponent', () => {
  let component: LandingPageComponent;
  let fixture: ComponentFixture<LandingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingPageComponent],
      providers: [{ provide: Router, useValue: mockRouter }],
    }).compileComponents();

    fixture = TestBed.createComponent(LandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
