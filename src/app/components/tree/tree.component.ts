import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedTreeDataService } from 'src/app/services/shared-tree-data.service';
import { TreeService } from 'src/app/services/tree.service';
import { Node } from '../../interfaces/interfaces';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
})
export class TreeComponent implements OnInit {
  nodes: Node[] = [];
  // get handle an tree template variable
  @ViewChild('myCoolTree') tree: any;

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
    treeSvc.getNodes().subscribe((res) => {
      this.nodes = res.nodes;
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.sharedDataSvc.tree = this.tree;
  }
}
