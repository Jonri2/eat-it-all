import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { TreeService } from 'src/app/services/tree.service';
import { Node } from 'src/app/interfaces/interfaces';
import { pickBy, identity, forEach } from 'lodash';
import { v4 } from 'uuid';
import { MultipleAutocompleteComponent } from '../multiple-autocomplete/multiple-autocomplete.component';

@Component({
  selector: 'app-add-food-tab',
  templateUrl: './add-food-tab.component.html',
  styleUrls: ['./add-food-tab.component.scss'],
})
export class AddFoodTabComponent {
  node: Node = {
    name: '',
    location: undefined,
    date: undefined,
  };
  currentRate = 0;
  @Output() submitted: EventEmitter<boolean> = new EventEmitter();
  @ViewChild(MultipleAutocompleteComponent)
  tagsComponent: MultipleAutocompleteComponent;

  constructor(private treeSvc: TreeService) {
    this.treeSvc.getNodes().subscribe((res) => {
      this.treeSvc.nodeAddedCallback();
    });
  }

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

    // Add tags that haven't already been added
    forEach(this.node.tags, (tag) => {
      if (!this.treeSvc.hasTag(tag)) {
        this.treeSvc.addNode({ id: v4(), name: tag, isTag: true });
      }
    });

    this.treeSvc.addNode(this.node);
    this.node = {
      name: '',
      location: undefined,
      date: undefined,
    };
    this.currentRate = 0;
    this.tagsComponent.clearSelections();
    this.submitted.emit(true);
  };
}
