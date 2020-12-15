import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Node, Tree } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class SharedTreeDataService {
  constructor() {}

  private treeSubject = new BehaviorSubject<Tree>({ treeModel: undefined });
  tree = this.treeSubject.asObservable();
  private _node: Node;

  setTree(tree: Tree) {
    this.treeSubject.next(tree);
  }

  getTree() {
    return this.treeSubject.getValue();
  }

  set node(node: Node) {
    this._node = node;
  }

  get node() {
    return this._node;
  }
}
