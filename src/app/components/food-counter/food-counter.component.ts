import { Component, OnInit } from '@angular/core';
import { TreeService } from 'src/app/services/tree.service';
import { Node } from '../../interfaces/interfaces';
import { map } from 'lodash';

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
      this._recursivelyCountNodes(res.nodes, []);
    });
    this.treeSvc.filter.subscribe((nodes) => {
      this.count = 0;
      const dataNodes = map(nodes, 'data');
      if (dataNodes.length && !dataNodes.includes(undefined)) {
        nodes = dataNodes;
      }
      this._recursivelyCountNodes(nodes, []);
    });
  }

  ngOnInit(): void {}

  /* Count number of nodes that aren't tags */
  private _recursivelyCountNodes = (nodes: Node[], ids: Node['id'][]) => {
    nodes?.forEach((node: Node) => {
      if (!node.isTag && !ids.includes(node.id)) {
        ids.push(node.id);
        this.count++;
      }
      this._recursivelyCountNodes(node.children, ids);
    });
  };
}
