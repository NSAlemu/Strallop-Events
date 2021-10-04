import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediumCategoryCardComponent } from './medium-category-card.component';

describe('MediumCategoryCardComponent', () => {
  let component: MediumCategoryCardComponent;
  let fixture: ComponentFixture<MediumCategoryCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MediumCategoryCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MediumCategoryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
