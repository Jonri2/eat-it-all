import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Filter, Node } from '../interfaces/interfaces';
import { forEach } from 'lodash';
import { TreeNode } from '@circlon/angular-tree-component';
import { map, filter, cloneDeep } from 'lodash';
import { Subject } from 'rxjs/internal/Subject';
import { Children } from 'react';

@Injectable({
  providedIn: 'root',
})
export class TreeService {
  private _nodes: Node[] = [];
  isLoading: boolean = true;
  private nodeAddedSubject = new Subject();
  nodeAdded = this.nodeAddedSubject.asObservable();
  private counterSubject = new Subject<Node[]>();
  counter = this.counterSubject.asObservable();
  private filterSubject = new Subject();
  filter$ = this.filterSubject.asObservable();
  userEmail: string = 'jde27@students.calvin.edu';
  nodeAddPending: boolean = false;

  constructor(private db: AngularFirestore) {
    this.getNodes().subscribe((res) => {
      this._nodes = res?.nodes;
      if (this.nodeAddPending) {
        this.nodeAddPending = false;
        this.nodeAddedCallback();
      }
    });
    this.userEmail = window.localStorage.getItem('email');
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

  addNode = (node: Node, oldNode?: Node) => {
    if (oldNode) {
      // // Copy over the id
      // TODO: need to do some hard logic to remove the node
      // node.id = oldNode.data.id;
      // const index = this._nodes.indexOf();
      // if (index > -1) {
      //   this._nodes.splice(index, 1);
      //   console.log("delete")
      // }
    }
    this.nodeAddPending = true;
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
    // Run this to reset the db
    this.getUserDoc().set({
      nodes: [
        {
          id: 1,
          name: 'Fruit',
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
          name: 'Meat',
          children: [
            { id: 5, name: '🐔 Cooked Chicken' },
            {
              id: 6,
              name: '🐄 Cow Related',
              children: [{ id: 7, name: '🍔 Hamburger' }],
              isTag: true,
            },
          ],
          isTag: true,
        },
      ],
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
      forEach(this._nodes, (node) => {
        if (this.hasTag(tag, node)) {
          tagFound = true;
        }
      });
    }
    return tagFound;
  };

  setNodes = () => {
    this.getUserDoc().set({ nodes: this._nodes });
  };

  getLocalNodes = () => {
    return cloneDeep(this._nodes);
  };

  nodeAddedCallback = () => {
    this.nodeAddedSubject.next();
  };

  counterCallback = (nodes: Node[]) => {
    this.counterSubject.next(nodes);
  };

  filterCallback = (filters: Filter) => {
    this.filterSubject.next(filters);
  };

  _getNames = (nodes: Node[]): string[] => {
    return map(nodes, 'name');
  };

  getDiff = (oldNodes: Node[], newNodes: Node[]): Node => {
    const idList = this.getIdList(oldNodes);
    return this.findDiffNode(newNodes, idList);
  };

  findDiffNode = (nodes: Node[], ids: Node['id'][]): Node => {
    let foundNode: Node;
    forEach(nodes, (node) => {
      if (!ids.includes(node.id) && !node.isTag) {
        foundNode = node;
      }
      if (!foundNode) {
        foundNode = this.findDiffNode(node.children, ids);
      }
    });
    return foundNode;
  };

  getIdList = (nodes: Node[], ids?: Node['id'][]): Node['id'][] => {
    if (!ids) {
      ids = [];
    }
    forEach(nodes, (node) => {
      ids.push(node.id);
      this.getIdList(node.children, ids);
    });
    return ids;
  };

  filterNodes = (
    nodes: Node[],
    filterFn: (node: Node) => boolean,
    checkboxes: Filter
  ): Node[] => {
    return filter(nodes, this.filterNode(filterFn, checkboxes));
  };

  filterNode = (
    filterFn: (node: Node) => boolean,
    checkboxes: Filter,
    turnVisible?: boolean
  ) => {
    return (node: Node): boolean => {
      const filterReturn = filterFn(node);
      let isVisible = false;

      if (node.children) {
        const filteredChildren: Node[] = [];
        node.children.forEach((child) => {
          // if the node passes filter and a search is occurring, show the children (according to the checkbox selection)
          let childFilter;
          if (
            !checkboxes.searchHasNoContent &&
            (filterReturn || turnVisible) &&
            ((checkboxes.tags && !checkboxes.food && child.isTag) ||
              !checkboxes.tags ||
              checkboxes.food)
          ) {
            childFilter = this.filterNode(filterFn, checkboxes, true)(child);
            childFilter && filteredChildren.push(child);
          }

          if (childFilter === undefined) {
            childFilter = this.filterNode(filterFn, checkboxes)(child);
          }
          // if one of node's children passes filter then this node is also visible
          if (childFilter) {
            isVisible = true;
            if (!filteredChildren.includes(child)) {
              filteredChildren.push(child);
            }
          }
        });
        node.children = filteredChildren;
      }
      return isVisible || turnVisible || filterReturn;
    };
  };

  moveNode = (from: TreeNode, to: TreeNode) => {
    const fromIndex = from.parent.children.indexOf(from);
    const fromParent = from.parent;
    const fromChildren = fromParent.getField('children');

    if (!to.parent.getField('children')) {
      to.parent.setField('children', []);
    }
    const toChildren = to.parent.getField('children');
    const originalNode = fromChildren.splice(fromIndex, 1)[0];

    let toIndex =
      fromParent === to.parent && to.index > fromIndex
        ? to.index - 1
        : to.index;
    toChildren.splice(toIndex, 0, originalNode);
    fromParent.treeModel.update();
    if (to.parent.treeModel !== fromParent.treeModel) {
      to.parent.treeModel.update();
    }
    this._nodes = fromParent.treeModel.nodes;
  };
}
