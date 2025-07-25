import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LargeEventCardComponent } from './large-event-card.component';

describe('LargeEventCardComponent', () => {
  let component: LargeEventCardComponent;
  let fixture: ComponentFixture<LargeEventCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LargeEventCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LargeEventCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
