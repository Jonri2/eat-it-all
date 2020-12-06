import { Component, Input, OnInit } from '@angular/core';
import { TreeNode } from '@circlon/angular-tree-component';

/* A custom expander that uses the Material Icons */
@Component({
  selector: 'app-tree-node-expander',
  templateUrl: './tree-node-expander.component.html',
  styleUrls: ['./tree-node-expander.component.scss']
})
export class TreeNodeExpanderComponent implements OnInit {

  @Input() node: TreeNode;

  constructor() { }

  ngOnInit(): void {
  }

}
