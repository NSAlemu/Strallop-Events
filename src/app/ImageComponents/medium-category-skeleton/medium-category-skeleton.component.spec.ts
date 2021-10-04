import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediumCategorySkeletonComponent } from './medium-category-skeleton.component';

describe('MediumCategorySkeletonComponent', () => {
  let component: MediumCategorySkeletonComponent;
  let fixture: ComponentFixture<MediumCategorySkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MediumCategorySkeletonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MediumCategorySkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
