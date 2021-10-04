import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOrgaizationLandingComponent } from './create-orgaization-landing.component';

describe('CreateOrgaizationLandingComponent', () => {
  let component: CreateOrgaizationLandingComponent;
  let fixture: ComponentFixture<CreateOrgaizationLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateOrgaizationLandingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOrgaizationLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
