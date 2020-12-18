import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Filter, Node } from '../interfaces/interfaces';
import { forEach } from 'lodash';
import { TreeNode } from '@circlon/angular-tree-component';
import { map, filter, cloneDeep } from 'lodash';
import { Subject } from 'rxjs/internal/Subject';

const resetTestData = false;

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
  private filterSubject = new Subject<Filter>();
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
      const nodeId = node.id;
      forEach(node.tags, (tag, i) => {
        node.id = `${nodeId}-${i}`;
        forEach(this._nodes, (topNode) => {
          this.searchTree(tag, cloneDeep(node), topNode);
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
    if (resetTestData) {
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
    }
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
    const idList = this.getNameList(oldNodes);
    return this.findDiffNode(newNodes, idList);
  };

  findDiffNode = (nodes: Node[], names: Node['name'][]): Node => {
    let foundNode: Node;
    forEach(nodes, (node) => {
      if (!names.includes(node.name) && !node.isTag) {
        foundNode = node;
      }
      if (!foundNode) {
        foundNode = this.findDiffNode(node.children, names);
      }
    });
    return foundNode;
  };

  getNameList = (nodes: Node[], names?: Node['name'][]): Node['name'][] => {
    if (!names) {
      names = [];
    }
    forEach(nodes, (node) => {
      names.push(node.name);
      this.getNameList(node.children, names);
    });
    return names;
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

  moveNode = (from: Node['id'], to: Node['id']): boolean => {
    if (from !== to) {
      const nodeToMove: Node = this.getAndRemoveById(from);
      to.toString().length < 15 && to.toString().length > 10
        ? this.addNodeAtId(nodeToMove)
        : this.addNodeAtId(nodeToMove, to);
      this.nodeAddedSubject.next();
      return nodeToMove !== undefined;
    }
  };

  getAndRemoveById = (id: Node['id'], nodes?: Node[]): Node => {
    let foundNode: Node;
    if (!nodes) {
      nodes = this._nodes;
    }
    for (let node of nodes) {
      if (node?.id === id) {
        foundNode = node;
        this.removeNode(node);
        break;
      }
      if (node?.children) {
        foundNode = this.getAndRemoveById(id, node.children);
        if (foundNode) {
          break;
        }
      }
    }
    return foundNode;
  };

  removeNode = (nodeToRemove: Node, nodes?: Node[]) => {
    if (!nodes) {
      nodes = this._nodes;
    }
    for (let node of nodes) {
      if (node?.children) {
        const index = node.children.indexOf(nodeToRemove);
        if (index > -1) {
          node.children.splice(index, 1);
          break;
        }
        this.removeNode(nodeToRemove, node.children);
      }
      if (node === nodeToRemove) {
        this._nodes.splice(this._nodes.indexOf(nodeToRemove), 1);
      }
    }
  };

  addNodeAtId = (nodeToAdd: Node, id?: Node['id'], nodes?: Node[]) => {
    if (!nodes) {
      nodes = this._nodes;
    }

    if (!id) {
      this._nodes.push(nodeToAdd);
      return;
    }

    for (let node of nodes) {
      if (node?.id === id) {
        node.children.push(nodeToAdd);
        break;
      }
      if (node?.children) {
        this.addNodeAtId(nodeToAdd, id, node.children);
      }
    }
  };
}
