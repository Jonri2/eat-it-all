import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
})
export class TreeComponent implements OnInit {
  // TODO: will need to add polyfill for mobile to work: https://angular2-tree.readme.io/v8.2.0/docs/drag-drop#mobile

  // TODO: make this dynamic from db.
  nodes = [
    {
      id: 1,
      name: 'Tag: Fruit',
      children: [
        { id: 2, name: 'Strawberry' },
        { id: 3, name: 'Water Melon' }
      ]
    },
    {
      id: 4,
      name: 'Tag: Meat',
      children: [
        { id: 5, name: 'Cooked Chicken' },
        {
          id: 6,
          name: 'Tag: Cow Related',
          children: [
            { id: 7, name: 'Hamburgers' }
          ]
        }
      ]
    }
  ];
  options = {
    allowDrag: true,
    allowDrop: true,
  };

  constructor() { }

  ngOnInit(): void {
  }

}
