import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { TreeService } from 'src/app/services/tree.service';
import { Node } from 'src/app/interfaces/interfaces';
import { pickBy, identity, forEach } from 'lodash';
import { v4 } from 'uuid';
import { MultipleAutocompleteComponent } from '../multiple-autocomplete/multiple-autocomplete.component';
import { SharedTreeDataService } from 'src/app/services/shared-tree-data.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-food-tab',
  templateUrl: './add-food-tab.component.html',
  styleUrls: ['./add-food-tab.component.scss'],
})
export class AddFoodTabComponent implements OnInit {
  node: Node = {
    name: '',
    location: undefined,
    date: undefined,
  };
  currentRate = 0;
  @Output() submitted: EventEmitter<boolean> = new EventEmitter();
  @ViewChild(MultipleAutocompleteComponent)
  tagsComponent: MultipleAutocompleteComponent;
  @Input() isEditing: boolean = false;
  oldNodeValues: Node;

  constructor(
    private treeSvc: TreeService,
    private sharedTreeSvc: SharedTreeDataService,
    private router: Router
  ) {}

  ngOnInit() {
    this._setEditingValues();
  }

  onRateChange = (rating: number) => {
    this.currentRate = rating;
  };

  onTagsChange = (tags: string[]) => {
    this.node.tags = tags;
  };

  onSubmit = (form: NgForm) => {
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

    this.isEditing
      ? this.treeSvc.editNode(this.node, this.oldNodeValues.data)
      : this.treeSvc.addNode(this.node);

    this.node = {
      name: '',
      location: undefined,
      date: undefined,
    };
    this.currentRate = 0;
    this.tagsComponent.clearSelections();

    form.resetForm();
    this.submitted.emit(true);
    this.isEditing && this.router.navigateByUrl('/list');
  };

  private _setEditingValues() {
    if (this.isEditing && this.sharedTreeSvc.node) {
      const {
        rating,
        location,
        tags,
        name,
        date,
      } = this.sharedTreeSvc.node.data;
      this.oldNodeValues = { ...this.sharedTreeSvc.node };
      this.currentRate = rating;
      this.node = {
        name,
        location,
        date,
        tags,
      };
    }
  }
}
