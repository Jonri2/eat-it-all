import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Node } from '../interfaces/interfaces';
import { forEach } from 'lodash';
import { TreeNode } from '@circlon/angular-tree-component';
import { map } from 'lodash';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root',
})
export class TreeService {
  private _nodes: Node[];
  isLoading: boolean = true;
  private nodeAddedSubject = new Subject();
  nodeAdded = this.nodeAddedSubject.asObservable();
  userEmail: string;

  constructor(private db: AngularFirestore) {
    this.getNodes().subscribe((res) => {
      this._nodes = res.nodes;
    });
  }

  getUserDoc = () => {
    const userDoc = this.db
      .collection('users')
      .doc<{ nodes: Node[] }>(this.userEmail);
    this.isLoading = false;
    return userDoc;
  };

  setUserDoc = (email: string) => {
    this.db.collection('users').doc(email).set({ nodes: [] });
  };

  /* Returns an observable of the node tree */
  getNodes = () => {
    return this.getUserDoc().valueChanges();
  };

  addNode = (node: Node) => {
    if (node.tags && node.tags.length) {
      forEach(node.tags, (tag) => {
        forEach(this._nodes, (topNode) => {
          this.searchTree(tag, node, topNode);
        });
      });
    } else if (!this._getNames(this._nodes).includes(node.name)) {
      this._nodes.push(node);
    }
    this.getUserDoc().set({ nodes: this._nodes });
  };

  searchTree = (tag: string, nodeToAdd: Node, currentNode: Node) => {
    if (
      currentNode.name === tag &&
      !this._getNames(currentNode.children).includes(nodeToAdd.name)
    ) {
      if (currentNode.children) {
        currentNode.children.push(nodeToAdd as TreeNode);
      } else {
        currentNode.children = [nodeToAdd as TreeNode];
      }
      return;
    }
    forEach(currentNode.children, (childNode) => {
      this.searchTree(tag, nodeToAdd, childNode);
    });
  };

  onLogin = (email: string) => {
    this.userEmail = email;
    this.getNodes().subscribe((res) => {
      this._nodes = res.nodes;
    });
    // Run this to reset the db
    // this.getUserDoc().set({
    //   nodes: [
    //     {
    //       id: 1,
    //       name: 'Tag: Fruit',
    //       children: [
    //         { id: 2, name: '🍎 Apple' },
    //         { id: 8, name: '🍋 Lemon' },
    //         { id: 9, name: '🍋🟩 Lime' },
    //         { id: 10, name: '🍊 Orange' },
    //         { id: 11, name: '🍓 Strawberry' },
    //       ],
    //       isTag: true,
    //     },
    //     {
    //       id: 4,
    //       name: 'Tag: Meat',
    //       children: [
    //         { id: 5, name: '🐔 Cooked Chicken' },
    //         {
    //           id: 6,
    //           name: '🐄 Tag: Cow Related',
    //           children: [{ id: 7, name: '🍔 Hamburger' }],
    //           isTag: true,
    //         },
    //       ],
    //       isTag: true,
    //     },
    //   ],
    // });
  };

  hasTag = (tag: string, node?: Node): boolean => {
    let tagFound = false;
    if (node) {
      if (tag === node.name) {
        return true;
      }
      forEach(node.children, (childNode) => {
        if (this.hasTag(tag, childNode)) {
          tagFound = true;
        }
      });
      // Initial Call
    } else {
      forEach(this._nodes, (node) => {
        if (this.hasTag(tag, node)) {
          tagFound = true;
        }
      });
    }
    return tagFound;
  };

  setNodes = (nodes: Node[]) => {
    this._nodes = nodes;
    this.getUserDoc().set({ nodes: this._nodes });
  };

  getLocalNodes = () => {
    return this._nodes;
  };

  nodeAddedCallback = () => {
    this.nodeAddedSubject.next();
  };

  _getNames = (nodes: Node[]): string[] => {
    return map(nodes, 'name');
  };
}
