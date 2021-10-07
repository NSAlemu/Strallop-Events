import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventImageUploadComponent } from './event-image-upload.component';

describe('EventImageUploadComponent', () => {
  let component: EventImageUploadComponent;
  let fixture: ComponentFixture<EventImageUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventImageUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventImageUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
