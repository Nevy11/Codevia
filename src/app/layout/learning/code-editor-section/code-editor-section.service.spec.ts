import { TestBed } from '@angular/core/testing';

import { CodeEditorSectionService } from './code-editor-section.service';

describe('CodeEditorSectionService', () => {
  let service: CodeEditorSectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CodeEditorSectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
