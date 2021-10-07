import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomCountdownTimerComponent } from './custom-countdown-timer.component';

describe('CustomCountdownTimerComponent', () => {
  let component: CustomCountdownTimerComponent;
  let fixture: ComponentFixture<CustomCountdownTimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomCountdownTimerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomCountdownTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
