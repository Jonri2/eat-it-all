import { Component, OnInit } from '@angular/core';
import { TreeService } from 'src/app/services/tree.service';
import { Node } from '../../interfaces/interfaces';

@Component({
  selector: 'app-food-counter',
  templateUrl: './food-counter.component.html',
  styleUrls: ['./food-counter.component.scss'],
})
export class FoodCounterComponent implements OnInit {
  count = 0;

  constructor(private treeSvc: TreeService) {
    this.treeSvc.getNodes().subscribe((res) => {
      this.count = 0;
      this._recursivelyCountNodes(res.nodes)
    });
  }

  ngOnInit(): void {}

  /* Count number of nodes that don't start with "Tag: " */
  private _recursivelyCountNodes = (nodes: Node[]) => {
    nodes?.forEach((node: Node) => {
      !node.name.startsWith('Tag: ') && this.count++;
      this._recursivelyCountNodes(node.children);
    });
  };
}
