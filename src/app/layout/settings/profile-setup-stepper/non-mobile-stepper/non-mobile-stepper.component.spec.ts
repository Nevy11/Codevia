import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonMobileStepperComponent } from './non-mobile-stepper.component';

describe('NonMobileStepperComponent', () => {
  let component: NonMobileStepperComponent;
  let fixture: ComponentFixture<NonMobileStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonMobileStepperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NonMobileStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
