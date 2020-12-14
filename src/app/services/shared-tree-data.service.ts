import { Injectable } from '@angular/core';
import { Node, Tree } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class SharedTreeDataService {
  constructor() {}

  private _tree: Tree;
  private _node: Node;

  set tree(tree: Tree) {
    this._tree = tree;
  }

  get tree() {
    return this._tree;
  }

  set node(node: Node) {
    this._node = node
  }

  get node() {
    return this._node;
  }
}
