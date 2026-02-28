import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiResponseViewComponent } from './ai-response-view.component';

describe('AiResponseViewComponent', () => {
  let component: AiResponseViewComponent;
  let fixture: ComponentFixture<AiResponseViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiResponseViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiResponseViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
