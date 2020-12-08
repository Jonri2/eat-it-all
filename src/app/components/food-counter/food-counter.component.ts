import { Component, OnInit } from '@angular/core';
import { TreeNode } from '@circlon/angular-tree-component';
import { TreeService } from 'src/app/services/tree.service';

type PartialTreeNode = Partial<TreeNode> & {
  name?: string;
};

@Component({
  selector: 'app-food-counter',
  templateUrl: './food-counter.component.html',
  styleUrls: ['./food-counter.component.scss'],
})
export class FoodCounterComponent implements OnInit {
  count = 0;

  constructor(private treeSvc: TreeService) {
    this._recursivelyCountNodes(
      (this.treeSvc.getNodes() as unknown) as PartialTreeNode[]
    );
  }

  ngOnInit(): void {}

  /* Count number of nodes that don't start with "Tag: " */
  private _recursivelyCountNodes = (nodes: PartialTreeNode[]) => {
    nodes?.forEach((node: PartialTreeNode) => {
      !node.name.startsWith('Tag: ') && this.count++;
      this._recursivelyCountNodes(node.children);
    });
  };
}
