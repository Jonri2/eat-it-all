import { Component, OnInit, ViewChild } from '@angular/core';
import { Tree } from 'src/app/interfaces';
import { SharedTreeDataService } from 'src/app/services/shared-tree-data.service';
import { TreeService } from 'src/app/services/tree.service';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
})
export class TreeComponent implements OnInit {
  // get handle an tree template variable
  @ViewChild('myCoolTree') tree: Tree;

  nodes = [];
  treeOptions = {
    allowDrag: true,
    allowDrop: true,
    animateExpand: true,
    animateSpeed: 5,
    animateAcceleration: 1.3,
  };

  constructor(
    private treeSvc: TreeService,
    private sharedDataSvc: SharedTreeDataService
  ) {
    this.nodes = this.treeSvc.getNodes();
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.sharedDataSvc.tree = this.tree;
  }
}
