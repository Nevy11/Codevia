import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoPromoComponent } from './video-promo.component';

describe('VideoPromoComponent', () => {
  let component: VideoPromoComponent;
  let fixture: ComponentFixture<VideoPromoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoPromoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoPromoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
