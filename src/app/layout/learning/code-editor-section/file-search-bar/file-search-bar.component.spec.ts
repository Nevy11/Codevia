import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileSearchBarComponent } from './file-search-bar.component';

describe('FileSearchBarComponent', () => {
  let component: FileSearchBarComponent;
  let fixture: ComponentFixture<FileSearchBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileSearchBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileSearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
