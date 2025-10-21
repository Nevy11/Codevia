import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PythonProcessingComponent } from './python-processing.component';

describe('PythonProcessingComponent', () => {
  let component: PythonProcessingComponent;
  let fixture: ComponentFixture<PythonProcessingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PythonProcessingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PythonProcessingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
