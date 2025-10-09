import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoFileSelectedComponent } from './no-file-selected.component';

describe('NoFileSelectedComponent', () => {
  let component: NoFileSelectedComponent;
  let fixture: ComponentFixture<NoFileSelectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoFileSelectedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoFileSelectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
