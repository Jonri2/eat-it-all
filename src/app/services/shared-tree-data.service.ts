import { Injectable } from '@angular/core';
import { TreeModel } from '@circlon/angular-tree-component';

interface Tree {
  treeModel: TreeModel;
}

@Injectable({
  providedIn: 'root',
})
export class SharedTreeDataService {
  constructor() {}

  private _tree: Tree;

  set tree(treeData: Tree) {
    this._tree = treeData;
  }

  get tree() {
    return this._tree;
  }
}
