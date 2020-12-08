import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  MatAutocompleteSelectedEvent,
  MatAutocomplete,
} from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
} from 'rxjs/operators';
import { TreeService } from 'src/app/services/tree.service';
import { Node } from '../../interfaces/interfaces';
import { forEach } from 'lodash';

// https://material.angular.io/components/chips/overview
// debounce ref: https://stackoverflow.com/questions/41308826/angular-2-debounce-ngmodelchange/52977862#52977862
@Component({
  selector: 'app-multiple-autocomplete',
  templateUrl: './multiple-autocomplete.component.html',
  styleUrls: ['./multiple-autocomplete.component.scss'],
})
export class MultipleAutocompleteComponent {
  visible = true;
  selectable = true;
  removable = true;
  searchCtrl = new FormControl();
  filteredOptions: Observable<string[]>;
  selectedValues: string[] = [];
  allOptions: string[] = [];

  @Input() separatorKeysCodes: number[] = [ENTER, COMMA];
  @Input() placeholder: string;
  @Input() width: string;
  @Input() callback: () => void;
  @Output() values: EventEmitter<string[]> = new EventEmitter();

  @ViewChild('searchInput') searchInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(private treeSvc: TreeService) {
    this.treeSvc.getNodes().subscribe((res) => {
      this.allOptions = [];
      forEach(res.nodes, (node) => {
        this.getNames(node);
      });
    });

    // Debounce is set to 30ms, since value changes frequently, which is imperceptible to the user.
    this.filteredOptions = this.searchCtrl.valueChanges
      .pipe(debounceTime(30), distinctUntilChanged())
      .pipe(
        startWith(null),
        map((val: string | null) =>
          val ? this._filter(val) : this.allOptions.slice()
        )
      );
  }

  getNames = (node: Node) => {
    this.allOptions.push(node.name);
    forEach(node.children, (child) => {
      this.getNames(child);
    });
  };

  /* Runs when the model changes (ngModelChange)
    To throttle being called, the debounce is set to 60 ms.
  */
  onChange = () => {
    this.searchCtrl.valueChanges
      .pipe(debounceTime(60), distinctUntilChanged())
      .subscribe(this.callback);
  };

  add = (event: MatChipInputEvent): void => {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.selectedValues.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.searchCtrl.setValue(null);
    this.values.emit(this.selectedValues);
  };

  remove = (value: string): void => {
    const index = this.selectedValues.indexOf(value);

    if (index >= 0) {
      this.selectedValues.splice(index, 1);
    }
    this.values.emit(this.selectedValues);
  };

  selected = (event: MatAutocompleteSelectedEvent): void => {
    this.selectedValues.push(event.option.viewValue);
    this.searchInput.nativeElement.value = '';
    this.searchCtrl.setValue(null);
    this.values.emit(this.selectedValues);
  };

  private _filter = (value: string): string[] => {
    const filterValue = value.toLowerCase();

    return this.allOptions.filter((val) =>
      val.toLowerCase().includes(filterValue)
    );
  };
}
