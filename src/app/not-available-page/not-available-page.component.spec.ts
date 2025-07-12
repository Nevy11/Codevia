import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotAvailablePageComponent } from './not-available-page.component';

describe('NotAvailablePageComponent', () => {
  let component: NotAvailablePageComponent;
  let fixture: ComponentFixture<NotAvailablePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotAvailablePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotAvailablePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
