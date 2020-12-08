import { Component } from '@angular/core';
import { TreeNode } from '@circlon/angular-tree-component';
import { SharedTreeDataService } from 'src/app/services/shared-tree-data.service';
import { fuzzySearch } from 'src/app/utils';

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

  constructor(private sharedDataSvc: SharedTreeDataService) {}

  /* will filter the tree and only display nodes that match selected values */
  filterTree = ({ selectedValues }: SelectedValues) => () => {
    const searchHasContent = selectedValues.length === 0;
    this._updateTreeNodes(searchHasContent, selectedValues);
  };

  /* Dynamically update nodes that are being shown */
  private _updateTreeNodes(
    searchHasNoContent: boolean,
    selectedValues: string[]
  ) {
    this.listOfFilteredNodes = [];
    this.sharedDataSvc.tree.treeModel.filterNodes((node: TreeNode) =>
      searchHasNoContent
        ? true
        : this._generateListOfFilteredNodes(selectedValues, node)
    );
    this.listOfFilteredNodes.forEach((node: TreeNode) => {
      this._recursivelyShowChildren(node);
    });
    this._shouldCollapseTree(searchHasNoContent);
  }

  /* collapse tree if nothing being being search for */
  private _shouldCollapseTree = (searchHasNoContent: boolean) => {
    if (searchHasNoContent) {
      this.sharedDataSvc.tree.treeModel.collapseAll();
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
  ) {
    const nodeExists = fuzzySearch(selectedValues, node.data.name);
    nodeExists && this.listOfFilteredNodes.push(node);
    return nodeExists;
  }
}
