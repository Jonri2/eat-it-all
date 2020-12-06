import { Component, OnInit, ViewChild } from '@angular/core';
import { TreeModel, TreeNode } from '@circlon/angular-tree-component';

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

  filterTree = (value: string, treeModel: TreeModel) => {
    treeModel.filterNodes((node: TreeNode) => fuzzySearch(value, node.data.name));
  }

  constructor(treeSvc: TreeService) {
    this.nodes = treeSvc.getNodes()
  }

  ngOnInit(): void {
  }

}

/* ref: https://github.com/CirclonGroup/angular-tree-component/blob/master/projects/example-app/src/app/filter/filter.component.ts */
const fuzzySearch = (needle: string, haystack: string) => {
  const haystackLC = haystack.toLowerCase();
  const needleLC = needle.toLowerCase();

  const hLen = haystack.length;
  const nLen = needleLC.length;

  if (nLen > hLen) {
    return false;
  }
  if (nLen === hLen) {
    return needleLC === haystackLC;
  }
  outer: for (let i = 0, j = 0; i < nLen; i++) {
    const nch = needleLC.charCodeAt(i);

    while (j < hLen) {
      if (haystackLC.charCodeAt(j++) === nch) {
        continue outer;
      }
    }
    return false;
  }
  return true;
}
