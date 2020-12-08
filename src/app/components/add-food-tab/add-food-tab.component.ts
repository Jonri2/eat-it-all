import { Component } from '@angular/core';
import { TreeService } from 'src/app/services/tree.service';
import { Node } from '../../interfaces/interfaces';
import { pickBy, identity } from 'lodash';
import { v4 } from 'uuid';

@Component({
  selector: 'app-add-food-tab',
  templateUrl: './add-food-tab.component.html',
  styleUrls: ['./add-food-tab.component.scss'],
})
export class AddFoodTabComponent {
  node: Node = {
    id: '',
    name: '',
    location: undefined,
    date: undefined,
  };

  constructor(private treeSvc: TreeService) {}

  onRateChange = (rating: number) => {
    this.node.rating = rating;
  };

  onTagsChange = (tags: string[]) => {
    this.node.tags = tags;
  };

  onSubmit = () => {
    this.node.id = v4();
    // Remove all falsy values
    this.node = pickBy(this.node, identity);
    this.treeSvc.addNode(this.node);
  };
}
