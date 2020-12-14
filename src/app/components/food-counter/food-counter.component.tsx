import { AfterViewInit, Component, ElementRef, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { TreeService } from 'src/app/services/tree.service';
import { Node } from '../../interfaces/interfaces';
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { Counter } from './notReact';

const containerElementName = 'myReactComponentContainer';

@Component({
  selector: 'app-food-counter',
  // templateUrl: './food-counter.component.html',
  template: `<span #${containerElementName}></span>`,
  styleUrls: ['./food-counter.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FoodCounterComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  @ViewChild(containerElementName, {static: false}) containerRef: ElementRef;

  count = 0;

  constructor(private treeSvc: TreeService) {
    this.treeSvc.getNodes().subscribe((res) => {
      this.count = 0;
      this._recursivelyCountNodes(res.nodes);
      this.render();
    });
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    this.render();
  }

  ngAfterViewInit() {
    this.render();
  }

  ngOnDestroy() {
    ReactDOM.unmountComponentAtNode(this.containerRef.nativeElement);
  }

  private render() {
    // ReactDOM.render(Counter({count: this.count}), this.containerRef.nativeElement);
    ReactDOM.render(<Counter count={this.count} />, this.containerRef.nativeElement);
  }

  /* Count number of nodes that don't start with "Tag: " */
  private _recursivelyCountNodes = (nodes: Node[]) => {
    nodes?.forEach((node: Node) => {
      !node.isTag && this.count++;
      this._recursivelyCountNodes(node.children);
    });
  };
}
