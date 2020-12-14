import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Node } from '../interfaces/interfaces';
import { forEach } from 'lodash';
import { TreeNode } from '@circlon/angular-tree-component';
import { map } from 'lodash';

const userName = 'user1';

@Injectable({
  providedIn: 'root',
})
export class TreeService {
  nodes: Node[];
  isLoading: boolean = true;

  constructor(private db: AngularFirestore) {
    this.getNodes().subscribe((res) => {
      this.nodes = res.nodes;
    });

    // Run this to reset the db
    this.getUserDoc().set({
      nodes: [
        {
          id: 1,
          name: 'Tag: Fruit',
          children: [
            { id: 2, name: '🍎 Apple' },
            { id: 8, name: '🍋 Lemon' },
            { id: 9, name: '🍋🟩 Lime' },
            { id: 10, name: '🍊 Orange' },
            { id: 11, name: '🍓 Strawberry' },
          ],
          isTag: true,
        },
        {
          id: 4,
          name: 'Tag: Meat',
          children: [
            { id: 5, name: '🐔 Cooked Chicken' },
            {
              id: 6,
              name: '🐄 Tag: Cow Related',
              children: [{ id: 7, name: '🍔 Hamburger' }],
              isTag: true,
            },
          ],
          isTag: true,
        },
      ],
    });
  }

  getUserDoc = () => {
    const userDoc = this.db
      .collection('users')
      .doc<{ nodes: Node[] }>(userName);
    this.isLoading = false;
    return userDoc;
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
    } else if (!this._getNames(this.nodes).includes(node.name)) {
      this.nodes.push(node);
    }
    this.getUserDoc().set({ nodes: this.nodes });
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
      forEach(this.nodes, (node) => {
        if (this.hasTag(tag, node)) {
          tagFound = true;
        }
      });
    }
    return tagFound;
  };

  setNodes = (nodes: Node[]) => {
    this.nodes = nodes;
    this.getUserDoc().set({ nodes: this.nodes });
  };

  _getNames = (nodes: Node[]): string[] => {
    return map(nodes, 'name');
  };
}
