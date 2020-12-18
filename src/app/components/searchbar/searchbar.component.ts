import { Component, Input } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Tree, Node } from 'src/app/interfaces/interfaces';
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
  listOfFilteredNodes: Node[] = [];
  selectedValues: string[] = [];
  @Input() food: boolean = true;
  @Input() tags: boolean = true;

  constructor(
    private sharedDataSvc: SharedTreeDataService,
    private treeSvc: TreeService
  ) {
    this.treeSvc.nodeAdded.subscribe(() => {
      if (this.tags && !this.food) {
        this.filterTree({ selectedValues: this.selectedValues })();
      }
    });
    this.treeSvc.filterCallback({ food: this.food, tags: this.tags });
  }

  /* will filter the tree and only display nodes that match selected values */
  filterTree = ({ selectedValues }: SelectedValues) => () => {
    const tree: Tree = this.sharedDataSvc.getTree();
    tree.treeModel.nodes = this.treeSvc.getLocalNodes();
    this.sharedDataSvc.setTree(tree);
    const searchHasContent = selectedValues.length === 0;
    this.selectedValues = selectedValues;
    this._updateTreeNodes(searchHasContent);

    // Update counter based on search
    if (searchHasContent) {
      this.treeSvc.counterCallback(this.treeSvc.getLocalNodes());
    } else if (this.listOfFilteredNodes.length) {
      this.treeSvc.counterCallback(this.listOfFilteredNodes);
    }
  };

  onCheckboxChange = (event: MatCheckboxChange, values: SelectedValues) => {
    this.treeSvc.filterCallback({ food: this.food, tags: this.tags });
    this.filterTree(values)();
  };

  /* Dynamically update nodes that are being shown */
  private _updateTreeNodes(searchHasNoContent: boolean) {
    this.listOfFilteredNodes = [];
    const tree: Tree = this.sharedDataSvc.getTree();
    const nodes: Node[] = this.treeSvc.filterNodes(
      tree.treeModel.nodes,
      (node: Node) => {
        let showNode = true;
        // If only the Tag checkbox is selected, hide the food nodes
        if (this.tags && !this.food) {
          showNode = node.isTag;
          // If only the Food checkbox is selected, add the food nodes to the filtered nodes list
        } else if (this.food && !this.tags) {
          if (!node.isTag) {
            this._generateListOfFilteredNodes(node);
          }
        }
        // If there is no search, don't filter the list
        // If there is, check if the node is found in the search. Filter it out if it is not
        return (
          showNode &&
          (searchHasNoContent || this._generateListOfFilteredNodes(node))
        );
      },
      { food: this.food, tags: this.tags, searchHasNoContent }
    );
    // Switch the tree to food items if the Food checkbox is set
    if (this.food && !this.tags) {
      tree.treeModel.nodes = this.listOfFilteredNodes;
    } else {
      tree.treeModel.nodes = nodes;
    }
    this.sharedDataSvc.setTree(tree);
  }

  /* Check if the node searched for exists and make a list.
    Return: true, if the node exists, false otherwise.
  */
  private _generateListOfFilteredNodes(node: Node): boolean {
    const nodeExists = fuzzySearch(this.selectedValues, node.name);
    const ids = map(this.listOfFilteredNodes, 'id');
    if (
      (!this.selectedValues.length || nodeExists) &&
      !ids.includes(node.id) &&
      !this._isFiltered(node)
    ) {
      this.listOfFilteredNodes.push(node);
    }
    return nodeExists;
  }

  private _isFiltered(node: Node): boolean {
    return (
      (!this.tags && this.food && node.isTag) ||
      (this.tags && !this.food && !node.isTag)
    );
  }
}
