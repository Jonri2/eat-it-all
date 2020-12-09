import { Injectable } from '@angular/core';
import { Tree } from '../interfaces/interfaces';

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
