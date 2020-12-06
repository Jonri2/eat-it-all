import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPopoverComponent } from './add-popover.component';

describe('AddPopoverComponent', () => {
  let component: AddPopoverComponent;
  let fixture: ComponentFixture<AddPopoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPopoverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
