import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeEditorSectionComponent } from './code-editor-section.component';

describe('CodeEditorSectionComponent', () => {
  let component: CodeEditorSectionComponent;
  let fixture: ComponentFixture<CodeEditorSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeEditorSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeEditorSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
