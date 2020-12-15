import { Component, Input } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { TreeNode } from '@circlon/angular-tree-component';
import { Tree } from 'src/app/interfaces/interfaces';
import { SharedTreeDataService } from 'src/app/services/shared-tree-data.service';
import { TreeService } from 'src/app/services/tree.service';
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
  @Input() food: boolean = true;
  @Input() tags: boolean = true;

  constructor(
    private sharedDataSvc: SharedTreeDataService,
    private treeSvc: TreeService
  ) {}

  /* will filter the tree and only display nodes that match selected values */
  filterTree = ({ selectedValues }: SelectedValues) => () => {
    const searchHasContent = selectedValues.length === 0;
    this._updateTreeNodes(searchHasContent, selectedValues);
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
      let filterBool = true;
      if (this.tags && !this.food) {
        filterBool = node.data.isTag;
      } else if (this.food && !this.tags) {
        filterBool = !node.data.isTag;
        if (filterBool) {
          this._generateListOfFilteredNodes(selectedValues, node);
        }
      }
      return (
        filterBool &&
        (searchHasNoContent ||
          this._generateListOfFilteredNodes(selectedValues, node))
      );
    });
    if (this.food && !this.tags && searchHasNoContent) {
      const tree: Tree = this.sharedDataSvc.getTree();
      tree.treeModel.nodes = this.listOfFilteredNodes;
      this.sharedDataSvc.setTree(tree);
    }
    this.listOfFilteredNodes.forEach((node: TreeNode) => {
      this._recursivelyShowChildren(node);
    });
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
    (!selectedValues.length || nodeExists) &&
      this.listOfFilteredNodes.push(node);
    return nodeExists;
  }
}
