import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { TreeService } from 'src/app/services/tree.service';
import { Node } from '../../interfaces/interfaces';
import { pickBy, identity } from 'lodash';
import { v4 } from 'uuid';
import { MultipleAutocompleteComponent } from '../multiple-autocomplete/multiple-autocomplete.component';

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
  currentRate = 0;
  @Output() submitted: EventEmitter<boolean> = new EventEmitter();
  @ViewChild(MultipleAutocompleteComponent)
  tagsComponent: MultipleAutocompleteComponent;

  constructor(private treeSvc: TreeService) {}

  onRateChange = (rating: number) => {
    this.currentRate = rating;
  };

  onTagsChange = (tags: string[]) => {
    this.node.tags = tags;
  };

  onSubmit = () => {
    this.node.id = v4();
    this.node.rating = this.currentRate;
    // Remove all falsy values
    this.node = pickBy(this.node, identity);
    this.treeSvc.addNode(this.node);
    this.node = {
      id: '',
      name: '',
      location: undefined,
      date: undefined,
    };
    this.currentRate = 0;
    this.tagsComponent.clearSelections();
    this.submitted.emit(true);
  };
}
