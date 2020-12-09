import { Component, OnInit, ViewChild } from '@angular/core';
import { MdePopoverTrigger } from '@material-extended/mde';

@Component({
  selector: 'app-add-popover',
  templateUrl: './add-popover.component.html',
  styleUrls: ['./add-popover.component.scss'],
})
export class AddPopoverComponent {
  @ViewChild(MdePopoverTrigger, { static: false }) trigger: MdePopoverTrigger;

  closePopover = () => {
    this.trigger.togglePopover();
  };
}
