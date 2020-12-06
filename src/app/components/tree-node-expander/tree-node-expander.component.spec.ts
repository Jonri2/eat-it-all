import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeNodeExpanderComponent } from './tree-node-expander.component';

describe('TreeNodeExpanderComponent', () => {
  let component: TreeNodeExpanderComponent;
  let fixture: ComponentFixture<TreeNodeExpanderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreeNodeExpanderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeNodeExpanderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
