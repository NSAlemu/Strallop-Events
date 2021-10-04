import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingSidenavComponent } from './setting-sidenav.component';

describe('SettingSidenavComponent', () => {
  let component: SettingSidenavComponent;
  let fixture: ComponentFixture<SettingSidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingSidenavComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
