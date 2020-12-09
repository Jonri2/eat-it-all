import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodCounterComponent } from './food-counter.component';

describe('FoodCounterComponent', () => {
  let component: FoodCounterComponent;
  let fixture: ComponentFixture<FoodCounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FoodCounterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
