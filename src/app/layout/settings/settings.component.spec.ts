// settings.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsComponent } from './settings.component';
import { ActivatedRoute } from '@angular/router'; // 1. Import ActivatedRoute
import { of } from 'rxjs'; // 2. Import 'of' to mock observables

// Define a simple mock object for ActivatedRoute
const mockActivatedRoute = {
  // Most components only need mock observables for params or data during creation
  params: of({}),
  queryParams: of({}),
  data: of({}),
  snapshot: {},
};

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsComponent],
      // 3. Add a providers array to satisfy the component's constructor
      providers: [{ provide: ActivatedRoute, useValue: mockActivatedRoute }],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
