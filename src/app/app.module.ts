import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MdePopoverModule } from '@material-extended/mde';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TreeModule } from '@circlon/angular-tree-component';
import { HeaderComponent } from './components/header/header.component';
import { SearchbarComponent } from './components/searchbar/searchbar.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { MultipleAutocompleteComponent } from './components/multiple-autocomplete/multiple-autocomplete.component';
import { AddPopoverComponent } from './components/add-popover/add-popover.component';
import { AddFoodTabComponent } from './components/add-food-tab/add-food-tab.component';
import { AddTagTabComponent } from './components/add-tag-tab/add-tag-tab.component';
import { TreeComponent } from './components/tree/tree.component';
import { TreeNodeExpanderComponent } from './components/tree-node-expander/tree-node-expander.component';
import { FoodCounterComponent } from './components/food-counter/food-counter.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SearchbarComponent,
    ToolbarComponent,
    MultipleAutocompleteComponent,
    AddPopoverComponent,
    AddFoodTabComponent,
    AddTagTabComponent,
    TreeComponent,
    TreeNodeExpanderComponent,
    FoodCounterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatAutocompleteModule,
    MatInputModule,
    MatChipsModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MdePopoverModule,
    MatCardModule,
    MatTabsModule,
    NgbModule,
    TreeModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
