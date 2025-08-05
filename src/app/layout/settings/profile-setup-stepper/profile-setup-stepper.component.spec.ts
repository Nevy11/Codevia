import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileSetupStepperComponent } from './profile-setup-stepper.component';

describe('ProfileSetupStepperComponent', () => {
  let component: ProfileSetupStepperComponent;
  let fixture: ComponentFixture<ProfileSetupStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileSetupStepperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileSetupStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
