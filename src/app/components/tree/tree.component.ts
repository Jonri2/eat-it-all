import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IActionMapping } from '@circlon/angular-tree-component';
import { map, cloneDeep } from 'lodash';
import { SharedTreeDataService } from 'src/app/services/shared-tree-data.service';
import { TreeService } from 'src/app/services/tree.service';
import { Filter, Node, Tree } from '../../interfaces/interfaces';

// References: https://stackoverflow.com/a/41427647/9931154
@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
})
export class TreeComponent implements OnInit, AfterViewInit {
  nodes: Node[] = [];
  foodNodes: Node[] = [];
  clickedNode: Node;
  filter: Filter;
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
          this.treeSvc.moveNode(from, to);
          this.treeSvc.setNodes();
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
    this.treeSvc.filter$.subscribe((filter: Filter) => {
      this.filter = filter;
    });
    this.treeSvc.getNodes().subscribe((res) => {
      if (this.filter.food && !this.filter.tags) {
        const addedNode: Node = this.treeSvc.getDiff(this.nodes, res.nodes);
        if (addedNode) {
          const foodNodesCopy = cloneDeep(this.foodNodes);
          foodNodesCopy.push(addedNode);
          this.foodNodes = foodNodesCopy;
        }
      }
      if (this.filter?.food || !this.filter?.tags) {
        this.nodes = res.nodes;
      }
    });
    this.sharedDataSvc.tree.subscribe((tree: Tree) => {
      const tempNodes: Node[] = map(tree.treeModel?.nodes, 'data');
      const nodes: Node[] =
        tempNodes.length > 0 && !tempNodes.includes(undefined)
          ? tempNodes
          : tree.treeModel?.nodes;
      if (this.filter?.food && !this.filter?.tags) {
        this.foodNodes = nodes;
      } else {
        this.nodes = nodes;
      }
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.sharedDataSvc.setTree(this.tree);
  }

  // ref: https://stackoverflow.com/a/39569933/9931154
  ngOnDestroy(): void {
    this.sharedDataSvc.node = this.clickedNode;
  }
}
