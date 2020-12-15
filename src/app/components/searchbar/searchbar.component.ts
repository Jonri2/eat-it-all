import { Component, Input } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { TreeNode } from '@circlon/angular-tree-component';
import { Tree } from 'src/app/interfaces/interfaces';
import { SharedTreeDataService } from 'src/app/services/shared-tree-data.service';
import { TreeService } from 'src/app/services/tree.service';
import { fuzzySearch } from 'src/app/utils';
import { map } from 'lodash';

interface SelectedValues {
  selectedValues: string[];
}

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss'],
})
export class SearchbarComponent {
  listOfFilteredNodes: TreeNode[] = [];
  @Input() food: boolean = true;
  @Input() tags: boolean = true;

  constructor(
    private sharedDataSvc: SharedTreeDataService,
    private treeSvc: TreeService
  ) {
    this.treeSvc.nodeAdded.subscribe(() => {
      this.filterTree({ selectedValues: [] })();
    });
  }

  /* will filter the tree and only display nodes that match selected values */
  filterTree = ({ selectedValues }: SelectedValues) => () => {
    const searchHasContent = selectedValues.length === 0;
    this._updateTreeNodes(searchHasContent, selectedValues);
    if (searchHasContent) {
      this.treeSvc.filterCallback(this.treeSvc.getLocalNodes());
    } else if (this.listOfFilteredNodes.length) {
      this.treeSvc.filterCallback(this.listOfFilteredNodes);
    }
  };

  onCheckboxChange = (event: MatCheckboxChange, values: SelectedValues) => {
    const tree: Tree = this.sharedDataSvc.getTree();
    tree.treeModel.nodes = this.treeSvc.getLocalNodes();
    this.sharedDataSvc.setTree(tree);
    this.filterTree(values)();
  };

  /* Dynamically update nodes that are being shown */
  private _updateTreeNodes(
    searchHasNoContent: boolean,
    selectedValues: string[]
  ) {
    this.listOfFilteredNodes = [];
    this.sharedDataSvc.getTree().treeModel.filterNodes((node: TreeNode) => {
      let showNode = true;
      // If only the Tag checkbox is selected, hide the food nodes
      if (this.tags && !this.food) {
        showNode = node.data.isTag;
        // If only the Food checkbox is selected, add the food nodes to the filtered nodes list
      } else if (this.food && !this.tags) {
        if (!node.data.isTag) {
          this._generateListOfFilteredNodes(selectedValues, node);
        }
      }
      // If there is no search, don't filter the list
      // If there is, check if the node is found in the search. Filter it out if it is not
      return (
        showNode &&
        (searchHasNoContent ||
          this._generateListOfFilteredNodes(selectedValues, node))
      );
    });
    // Switch the tree to food items if the Food checkbox is set
    // Only works when there is no search
    if (this.food && !this.tags && searchHasNoContent) {
      const tree: Tree = this.sharedDataSvc.getTree();
      tree.treeModel.nodes = this.listOfFilteredNodes;
      this.sharedDataSvc.setTree(tree);
    } else if (!this.tags || this.food) {
      this.listOfFilteredNodes.forEach((node: TreeNode) => {
        this._recursivelyShowChildren(node);
      });
    }
    this._shouldCollapseTree(searchHasNoContent);
  }

  /* collapse tree if nothing being being search for */
  private _shouldCollapseTree = (searchHasNoContent: boolean) => {
    if (searchHasNoContent) {
      this.sharedDataSvc.getTree().treeModel.collapseAll();
    }
  };

  /* show all children for a node, recursively.
    The base case is handled by node.children?
  */
  private _recursivelyShowChildren(node: TreeNode) {
    node.children?.forEach((child: TreeNode) => {
      child.show();
      this._recursivelyShowChildren(child);
    });
  }

  /* Check if the node searched for exists and make a list.
    Return: true, if the node exists, false otherwise.
  */
  private _generateListOfFilteredNodes(
    selectedValues: string[],
    node: TreeNode
  ): boolean {
    const nodeExists = fuzzySearch(selectedValues, node.data.name);
    const ids = map(this.listOfFilteredNodes, 'id');
    (!selectedValues.length || nodeExists) &&
      !ids.includes(node.data.id) &&
      this.listOfFilteredNodes.push(node);
    return nodeExists;
  }
}
