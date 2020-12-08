import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
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
  separatorKeysCodes: number[] = [ENTER, COMMA];
  searchCtrl = new FormControl();
  filteredOptions: Observable<string[]>;
  selectedValues: string[] = [];
  allOptions: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];

  @Input() placeholder: string;
  @Input() width: string;
  @Input() callback: () => void;

  @ViewChild('searchInput') searchInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor() {
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

  /* Runs when the model changes (ngModelChange)
  */
  onChange = () => {
    this.callback();
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
  };

  remove = (value: string): void => {
    const index = this.selectedValues.indexOf(value);

    if (index >= 0) {
      this.selectedValues.splice(index, 1);
    }
    this.callback();
  };

  selected = (event: MatAutocompleteSelectedEvent): void => {
    this.selectedValues.push(event.option.viewValue);
    this.searchInput.nativeElement.value = '';
    this.searchCtrl.setValue(null);
  };

  private _filter = (value: string): string[] => {
    const filterValue = value.toLowerCase();

    return this.allOptions.filter(
      (val) => val.toLowerCase().indexOf(filterValue) === 0
    );
  };
}
