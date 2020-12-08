import { Component, OnInit } from '@angular/core';
import { TreeService } from 'src/app/services/tree.service';
import { Node } from '../../interfaces/interfaces';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
})
export class TreeComponent implements OnInit {
  nodes: Node[] = [];
  treeOptions = {
    allowDrag: true,
    allowDrop: true,
    animateExpand: true,
    animateSpeed: 5,
    animateAcceleration: 1.3,
  };

  constructor(private treeSvc: TreeService) {
    treeSvc.getNodes().subscribe((res) => {
      this.nodes = res.nodes;
    });
  }

  ngOnInit(): void {}
}
