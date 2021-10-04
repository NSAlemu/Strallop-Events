import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebisteAppComponent } from './webiste-app.component';

describe('WebisteAppComponent', () => {
  let component: WebisteAppComponent;
  let fixture: ComponentFixture<WebisteAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebisteAppComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebisteAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
