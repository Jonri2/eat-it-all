import { Component, OnInit } from '@angular/core';

// TODO: is this where I import it?
import { TreeService } from 'src/app/services/tree.service';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
})
export class TreeComponent implements OnInit {
  nodes = [];
  treeOptions = {
    allowDrag: true,
    allowDrop: true,
    animateExpand: true,
    animateSpeed: 5,
    animateAcceleration: 1.3,
  };

  constructor(treeSvc: TreeService) {
    this.nodes = treeSvc.getNodes()
  }

  ngOnInit(): void {
  }

}
