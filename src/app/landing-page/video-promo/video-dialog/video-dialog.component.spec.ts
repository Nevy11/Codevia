import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { VideoDialogComponent } from './video-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
const mockRouter = {
  navigate: jasmine.createSpy('navigate'),
  navigateByUrl: jasmine.createSpy('navigateByUrl'),
};

const matDialogRef = {
  close: jasmine.createSpy('close'),
};

const matDialogData = {
  videoUrl: 'https://www.youtube.com/embed/mock-video-id',
  title: 'Mock Video',
};

describe('VideoDialogComponent', () => {
  let component: VideoDialogComponent;
  let fixture: ComponentFixture<VideoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoDialogComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: MAT_DIALOG_DATA, useValue: matDialogData },
        { provide: MatDialogRef, useValue: matDialogRef },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VideoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
