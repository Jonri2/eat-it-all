import { Component, OnInit } from '@angular/core';

// TODO: is this where I import it?
import { TreeService } from 'src/app/services/tree.service';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
})
export class TreeComponent implements OnInit {
  // TODO: will need to add polyfill for mobile to work: https://angular2-tree.readme.io/v8.2.0/docs/drag-drop#mobile
  nodes = [];
  treeOptions = {
    allowDrag: true,
    allowDrop: true,
  };

  constructor(treeSvc: TreeService) {
    this.nodes = treeSvc.getNodes()
  }

  ngOnInit(): void {
  }

}
