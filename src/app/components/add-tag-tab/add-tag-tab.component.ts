import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Node } from 'src/app/interfaces/interfaces';
import { SharedTreeDataService } from 'src/app/services/shared-tree-data.service';
import { TreeService } from 'src/app/services/tree.service';
import { v4 } from 'uuid';
import { forEach } from 'lodash';
import { MultipleAutocompleteComponent } from '../multiple-autocomplete/multiple-autocomplete.component';

@Component({
  selector: 'app-add-tag-tab',
  templateUrl: './add-tag-tab.component.html',
  styleUrls: ['./add-tag-tab.component.scss'],
})
export class AddTagTabComponent implements OnInit {
  node: Node = {
    name: '',
    isTag: true,
  };
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

  onTagsChange = (tags: string[]) => {
    this.node.tags = tags;
  };

  onSubmit = (form: NgForm) => {
    this.node.id = v4();

    // Add tags that haven't already been added
    forEach(this.node.tags, (tag) => {
      if (!this.treeSvc.hasTag(tag)) {
        this.treeSvc.addNode({ id: v4(), name: tag, isTag: true });
      }
    });

    this.treeSvc.addNode(this.node);
    this.node = {
      name: '',
    };
    this.tagsComponent.clearSelections();
    form.resetForm();
    this.submitted.emit(true);
    this.isEditing && this.router.navigateByUrl('/list');
  };

  private _setEditingValues() {
    if (this.isEditing && this.sharedTreeSvc.node) {
      const { tags, name } = this.sharedTreeSvc.node.data;
      this.oldNodeValues = { ...this.sharedTreeSvc.node };
      this.node = {
        name,
        tags,
        isTag: true,
      };
    }
  }
}
