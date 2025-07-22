import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopLoginSignupComponent } from './top-login-signup.component';

describe('TopLoginSignupComponent', () => {
  let component: TopLoginSignupComponent;
  let fixture: ComponentFixture<TopLoginSignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopLoginSignupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopLoginSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
