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
    // this._recursivelyCountNodes(
    //   (this.treeSvc.getNodes() as unknown) as PartialTreeNode[]
    // );
    this.treeSvc.getNodes().subscribe((res) => {
      // forEach(res.nodes, (node) => {
      //   this.getNames(node);
      // });
      // console.log(res);
      // this._recursivelyCountNodes(res.nodes)
    });
    // console.log(this.treeSvc.getNodes());
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
