import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IActionMapping, TREE_ACTIONS } from '@circlon/angular-tree-component';
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
export class TreeComponent implements OnInit, AfterViewInit {
  nodes: Node[] = [];
  clickedNode: Node;
  // get handle on tree template variable
  @ViewChild('myCoolTree') tree: Tree;

  /* Provide custom callbacks */
  actionMapping: IActionMapping = {
    mouse: {
      click: (tree, node, $event) => {
        this.clickedNode = node;
        this.router.navigateByUrl(`/view/${node.id}`);
      },
      drop: (tree, node, $event, { from, to }) => {
        if (
          !map(to.parent.children, 'id').includes(from.data.id) &&
          (to.parent.data.isTag || !to.parent.parent)
        ) {
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
    this.sharedDataSvc.tree.subscribe((tree: Tree) => {
      const nodes: Node[] = map(tree.treeModel?.nodes, 'data');
      this.nodes =
        nodes.length > 0 && !nodes.includes(undefined)
          ? nodes
          : tree.treeModel?.nodes;
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.sharedDataSvc.setTree(this.tree);
    this.tree.treeModel.collapseAll();
  }

  // ref: https://stackoverflow.com/a/39569933/9931154
  ngOnDestroy(): void {
    this.sharedDataSvc.node = this.clickedNode;
  }
}
