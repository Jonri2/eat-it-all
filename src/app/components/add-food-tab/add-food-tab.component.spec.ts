import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFoodTabComponent } from './add-food-tab.component';

describe('AddFoodTabComponent', () => {
  let component: AddFoodTabComponent;
  let fixture: ComponentFixture<AddFoodTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFoodTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFoodTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
