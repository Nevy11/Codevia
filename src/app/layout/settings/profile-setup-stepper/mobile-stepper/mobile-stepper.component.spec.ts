import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileStepperComponent } from './mobile-stepper.component';

describe('MobileStepperComponent', () => {
  let component: MobileStepperComponent;
  let fixture: ComponentFixture<MobileStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileStepperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
