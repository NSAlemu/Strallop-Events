import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterCheckoutComponent } from './register-checkout.component';

describe('RegisterCheckoutComponent', () => {
  let component: RegisterCheckoutComponent;
  let fixture: ComponentFixture<RegisterCheckoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterCheckoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
