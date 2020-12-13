import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedTreeDataService } from 'src/app/services/shared-tree-data.service';
import { TreeService } from 'src/app/services/tree.service';
import { Node } from '../../../interfaces/interfaces';

@Component({
  selector: 'app-view-food-page',
  templateUrl: './view-food-page.component.html',
  styleUrls: ['./view-food-page.component.scss'],
})
export class ViewFoodPageComponent implements OnInit {
  nodes: Node[] = [];
  node: Node;
  id: string;
  isUndefined: boolean = false;
  isTreeLoading: boolean = true;

  constructor(
    private treeSvc: TreeService,
    private route: ActivatedRoute,
    private sharedDataSvc: SharedTreeDataService
  ) {
    this.treeSvc.getNodes().subscribe((res) => {
      this.nodes = res.nodes;
      this._fallbackData();
      this.isTreeLoading = this.treeSvc.isLoading;
    });
  }

  ngOnInit(): void {
    this._setPageData();
  }

  /* this.node is undefined, then try to get the data
    from the shared data that is taken from the DB
  */
  private _fallbackData = () => {
    if (this.node === undefined) {
      [this.node] = this.nodes.filter((n) => n.id === this.id);
    }

    // Possibly undefined after filter.
    this.isUndefined = this.node === undefined;
  };

  /* When routing to the page, it sets the node data
    and handles several different cases.
    Ref: https://stackoverflow.com/a/47382088/9931154
  */
  private _setPageData() {
    this.node = this.sharedDataSvc.node;
    this.id = this.route.snapshot.paramMap.get('id');

    // Slow fallback if we routed to this page going to the list first
    if (this.node?.id !== this.id) {
      this._fallbackData();
    }
  }
}
