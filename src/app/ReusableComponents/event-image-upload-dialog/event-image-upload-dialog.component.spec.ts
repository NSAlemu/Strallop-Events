import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventImageUploadDialogComponent } from './event-image-upload-dialog.component';

describe('EventImageUploadDialogComponent', () => {
  let component: EventImageUploadDialogComponent;
  let fixture: ComponentFixture<EventImageUploadDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventImageUploadDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventImageUploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
