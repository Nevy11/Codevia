import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LearningComponent } from './learning.component';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { LearningService } from './learning.service';
import { SupabaseClientService } from '../../supabase-client.service';
import { PLATFORM_ID } from '@angular/core';

const MockRouter = {
  navigate: jasmine.createSpy('navigate'),
  navigateByUrl: jasmine.createSpy('navigateByUrl'),
};

const MockActivatedRoute = {
  queryParams: of({ video: 'mockVideoId' }),
};

const MockLearningService = {
  loadShowYT: jasmine
    .createSpy('loadShowYT')
    .and.returnValue(Promise.resolve()),
};

const MockSupabaseService = {
  client: {
    auth: { getSession: () => Promise.resolve({ data: { session: null } }) },
  },
};

describe('LearningComponent', () => {
  let component: LearningComponent;
  let fixture: ComponentFixture<LearningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LearningComponent],
      providers: [
        { provide: Router, useValue: MockRouter },
        { provide: ActivatedRoute, useValue: MockActivatedRoute },
        { provide: LearningService, useValue: MockLearningService },
        { provide: SupabaseClientService, useValue: MockSupabaseService },
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LearningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
