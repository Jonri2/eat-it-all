import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  IActionMapping,
  TREE_ACTIONS,
  TreeNode,
} from '@circlon/angular-tree-component';
import { map } from 'lodash';
import { SharedTreeDataService } from 'src/app/services/shared-tree-data.service';
import { TreeService } from 'src/app/services/tree.service';
import { Node, Tree } from '../../interfaces/interfaces';

// References: https://stackoverflow.com/a/41427647/9931154
@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
})
export class TreeComponent implements OnInit {
  nodes: Node[] = [];
  clickedNode: Node;
  // get handle an tree template variable
  @ViewChild('myCoolTree') tree: Tree;

  /* Provide custom callbacks */
  actionMapping: IActionMapping = {
    mouse: {
      click: (tree, node, $event) => {
        this.clickedNode = node;
        this.router.navigateByUrl(`/view/${node.id}`);
      },
      drop: (tree, node, $event, { from, to }) => {
        if (!map(to.parent.children, 'id').includes(from.data.id)) {
          TREE_ACTIONS.MOVE_NODE(tree, node, $event, { from, to });
          this.treeSvc.setNodes(this.nodes);
        }
      },
    },
  };

  treeOptions = {
    allowDrag: true,
    allowDrop: true,
    animateExpand: true,
    animateSpeed: 5,
    animateAcceleration: 1.3,
    actionMapping: this.actionMapping,
  };

  constructor(
    private treeSvc: TreeService,
    private sharedDataSvc: SharedTreeDataService,
    private router: Router
  ) {
    this.treeSvc.getNodes().subscribe((res) => {
      this.nodes = res.nodes;
    });
  }

  ngOnInit(): void {
    this.sharedDataSvc.tree = this.tree;
  }

  // ref: https://stackoverflow.com/a/39569933/9931154
  ngOnDestroy(): void {
    this.sharedDataSvc.node = this.clickedNode;
  }
}
