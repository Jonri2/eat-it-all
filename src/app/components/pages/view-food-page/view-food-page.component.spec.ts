import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFoodPageComponent } from './view-food-page.component';

describe('ViewFoodPageComponent', () => {
  let component: ViewFoodPageComponent;
  let fixture: ComponentFixture<ViewFoodPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewFoodPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewFoodPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
