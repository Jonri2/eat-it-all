import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MdePopoverTrigger } from '@material-extended/mde';

@Component({
  selector: 'app-add-popover',
  templateUrl: './add-popover.component.html',
  styleUrls: ['./add-popover.component.scss'],
})
export class AddPopoverComponent {
  @ViewChild(MdePopoverTrigger, { static: false }) trigger: MdePopoverTrigger;

  @Input() buttonType: string = 'add';
  @Input() editType: string = 'none';
  isEditingFood: boolean = false;
  isEditingTag: boolean = false;

  ngOnInit() {
    this.isEditingFood = this.editType === 'food';
    this.isEditingTag = this.editType === 'tag';
  }

  closePopover = () => {
    this.trigger.togglePopover();
  };
}
