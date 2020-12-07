import { Component } from '@angular/core';
import { TreeModel, TreeNode } from '@circlon/angular-tree-component';
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
  public tree: { treeModel: TreeModel };

  constructor(private sharedDataSvc: SharedTreeDataService) {}

  /* will filter the tree and only display nodes that match selected values */
  filterTree = ({selectedValues}: SelectedValues) => () => {
    this.sharedDataSvc.tree.treeModel.filterNodes((node: TreeNode) =>
      selectedValues.length === 0 ? true : fuzzySearch(selectedValues, node.data.name)
    );
  };
}
