import { Component, OnInit, ViewChild } from '@angular/core';
import { TreeModel, TreeNode, TreeVirtualScroll } from '@circlon/angular-tree-component';

// TODO: is this where I import it?
import { TreeService } from 'src/app/services/tree.service';
import { fuzzySearch } from 'src/app/utils';

interface SelectedValues {
  selectedValues: string[];
}

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
})
export class TreeComponent implements OnInit {
  // get handle an tree template variable
  @ViewChild('tree') tree: any;

  nodes = [];
  treeOptions = {
    allowDrag: true,
    allowDrop: true,
    animateExpand: true,
    animateSpeed: 5,
    animateAcceleration: 1.3,
  };

  /* will filter the tree and only display nodes that match selected values */
  filterTree = (inputObj: SelectedValues, treeModel: TreeModel) => {
    treeModel.filterNodes((node: TreeNode) =>
      fuzzySearch(inputObj.selectedValues, node.data.name)
    );
  };

  constructor(treeSvc: TreeService) {
    this.nodes = treeSvc.getNodes();
  }

  ngOnInit(): void {}

}
