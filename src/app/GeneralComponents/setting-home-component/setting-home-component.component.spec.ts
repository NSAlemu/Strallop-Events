import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingHomeComponentComponent } from './setting-home-component.component';

describe('SettingHomeComponentComponent', () => {
  let component: SettingHomeComponentComponent;
  let fixture: ComponentFixture<SettingHomeComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingHomeComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingHomeComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
