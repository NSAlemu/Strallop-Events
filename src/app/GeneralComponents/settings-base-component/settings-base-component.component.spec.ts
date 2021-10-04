import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsBaseComponentComponent } from './settings-base-component.component';

describe('SettingsBaseComponentComponent', () => {
  let component: SettingsBaseComponentComponent;
  let fixture: ComponentFixture<SettingsBaseComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingsBaseComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsBaseComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
