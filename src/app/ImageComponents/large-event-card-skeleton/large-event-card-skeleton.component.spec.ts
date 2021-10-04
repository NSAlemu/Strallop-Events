import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LargeEventCardSkeletonComponent } from './large-event-card-skeleton.component';

describe('LargeEventCardSkeletonComponent', () => {
  let component: LargeEventCardSkeletonComponent;
  let fixture: ComponentFixture<LargeEventCardSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LargeEventCardSkeletonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LargeEventCardSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
