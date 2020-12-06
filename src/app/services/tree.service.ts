import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TreeService {
  // TODO: make this dynamic from db.
  private nodes = [
    {
      id: 1,
      name: 'Tag: Fruit',
      children: [
        { id: 2, name: '🍎 Apple' },
        { id: 8, name: '🍋 Lemon' },
        { id: 9, name: '🍋🟩 Lime' },
        { id: 10, name: '🍊 Orange' },
        { id: 11, name: '🍓 Strawberry' },
      ],
    },
    {
      id: 4,
      name: 'Tag: Meat',
      children: [
        { id: 5, name: '🐔 Cooked Chicken' },
        {
          id: 6,
          name: '🐄 Tag: Cow Related',
          children: [{ id: 7, name: '🍔 Hamburger' }],
        },
      ],
    },
  ];

  constructor() {}

  /* Returns all nodes on the tree */
  getNodes = () => {
    return this.nodes;
  };
}
