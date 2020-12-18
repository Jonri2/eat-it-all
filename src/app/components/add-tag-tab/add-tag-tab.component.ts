import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Node } from 'src/app/interfaces/interfaces';
import { TreeService } from 'src/app/services/tree.service';
import { v4 } from 'uuid';
import { MultipleAutocompleteComponent } from '../multiple-autocomplete/multiple-autocomplete.component';

@Component({
  selector: 'app-add-tag-tab',
  templateUrl: './add-tag-tab.component.html',
  styleUrls: ['./add-tag-tab.component.scss'],
})
export class AddTagTabComponent {
  node: Node = {
    name: '',
    isTag: true,
  };
  @Output() submitted: EventEmitter<boolean> = new EventEmitter();
  @ViewChild(MultipleAutocompleteComponent)
  tagsComponent: MultipleAutocompleteComponent;

  constructor(private treeSvc: TreeService) {}

  onTagsChange = (tags: string[]) => {
    this.node.tags = tags;
  };

  onSubmit = (form: NgForm) => {
    this.node.id = v4();
    this.treeSvc.addNode(this.node);
    this.node = {
      name: '',
    };
    this.tagsComponent.clearSelections();
    form.resetForm();
    this.submitted.emit(true);
  };
}
