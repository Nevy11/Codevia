// search-dialog.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchDialogComponent } from './search-dialog.component';

// 1. Import dependencies needed for mocking
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// If you are using a different dialog library, replace MatDialogRef/MAT_DIALOG_DATA accordingly.

// 2. Define mock objects for the dependencies
const mockDialogRef = {
  close: jasmine.createSpy('close'), // A spy to track if 'close' is called
};

const mockDialogData = {
  // Define any specific data structure your component expects on launch.
  // For 'should create', an empty object is usually sufficient.
  exampleData: 'test',
};

describe('SearchDialogComponent', () => {
  let component: SearchDialogComponent;
  let fixture: ComponentFixture<SearchDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchDialogComponent],
      // 3. Provide the mock services
      providers: [
        // Provider for the reference used to close the dialog
        { provide: MatDialogRef, useValue: mockDialogRef },

        // Provider for the input data passed to the dialog
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
