import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingTeamManagementComponentComponent } from './setting-team-management-component.component';

describe('SettingTeamManagementComponentComponent', () => {
  let component: SettingTeamManagementComponentComponent;
  let fixture: ComponentFixture<SettingTeamManagementComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingTeamManagementComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingTeamManagementComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
