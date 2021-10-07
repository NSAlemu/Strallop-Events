import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingAccountCloseComponent } from './setting-account-close.component';

describe('SettingAccountCloseComponent', () => {
  let component: SettingAccountCloseComponent;
  let fixture: ComponentFixture<SettingAccountCloseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingAccountCloseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingAccountCloseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
