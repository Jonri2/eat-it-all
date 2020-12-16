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
  isEditingFood: boolean = false;

  ngOnInit () {
    this.isEditingFood = this.buttonType === 'edit';
  }

  closePopover = () => {
    this.trigger.togglePopover();
  };
}
