import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Node } from '../interfaces/interfaces';
import { forEach } from 'lodash';
import { TreeNode } from '@circlon/angular-tree-component';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class TreeService {
  nodes: Node[] = [];
  isLoading: boolean = true;
  userEmail: string;

  constructor(private db: AngularFirestore) {
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
        forEach(this.nodes, (topNode) => {
          this.searchTree(tag, node, topNode);
        });
      });
    } else {
      this.nodes.push(node);
    }
    this.getUserDoc().set({ nodes: this.nodes });
  };

  searchTree = (tag: string, nodeToAdd: Node, currentNode: Node) => {
    if (currentNode.name === tag) {
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
      this.nodes = res.nodes;
    });
  };
}
