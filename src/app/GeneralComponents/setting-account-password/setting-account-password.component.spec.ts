import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingAccountPasswordComponent } from './setting-account-password.component';

describe('SettingAccountPasswordComponent', () => {
  let component: SettingAccountPasswordComponent;
  let fixture: ComponentFixture<SettingAccountPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingAccountPasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingAccountPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
