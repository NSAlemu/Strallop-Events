import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterTicketsComponent } from './register-tickets.component';

describe('RegisterTicketsComponent', () => {
  let component: RegisterTicketsComponent;
  let fixture: ComponentFixture<RegisterTicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterTicketsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
