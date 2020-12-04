import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  MatAutocompleteSelectedEvent,
  MatAutocomplete,
} from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

// https://material.angular.io/components/chips/overview
@Component({
  selector: 'searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss'],
})
export class SearchbarComponent {
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  searchCtrl = new FormControl();
  filteredOptions: Observable<string[]>;
  selectedValues: string[] = [];
  allOptions: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];

  @ViewChild('searchInput') searchInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor() {
    this.filteredOptions = this.searchCtrl.valueChanges.pipe(
      startWith(null),
      map((val: string | null) =>
        val ? this._filter(val) : this.allOptions.slice()
      )
    );
  }

  add(event: MatChipInputEvent): void {
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
  }

  remove(value: string): void {
    const index = this.selectedValues.indexOf(value);

    if (index >= 0) {
      this.selectedValues.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedValues.push(event.option.viewValue);
    this.searchInput.nativeElement.value = '';
    this.searchCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allOptions.filter(
      (val) => val.toLowerCase().indexOf(filterValue) === 0
    );
  }
}
