import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTagTabComponent } from './add-tag-tab.component';

describe('AddTagTabComponent', () => {
  let component: AddTagTabComponent;
  let fixture: ComponentFixture<AddTagTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTagTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTagTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
