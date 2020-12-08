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
    this.sharedDataSvc.tree.treeModel.filterNodes((node: TreeNode) =>
      searchHasNoContent ? true : fuzzySearch(selectedValues, node.data.name)
    );
    this._collapseTree(searchHasNoContent);
  }

  /* collapse tree if nothing being being search for */
  private _collapseTree = (searchHasNoContent: boolean) => {
    if (searchHasNoContent) {
      this.sharedDataSvc.tree.treeModel.collapseAll();
    }
  };
}
