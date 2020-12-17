import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import * as ReactDOM from "react-dom";
import * as React from "react";
import { AnimateShowAndHide } from "./notReact";

const containerElementName = "myReactComponentContainer";

/* This displays a value with a nice animation.
  There is this really cool UI library that allows
  on to make user interfaces really easily using
  declarative, functional programming.
Ref: https://medium.com/@zacky_14189/embedding-react-components-in-angular-the-easy-way-60f796b68aef
*/
@Component({
  selector: "app-animated",
  template: `<span #${containerElementName}></span>`,
  styleUrls: ["./animated.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class AnimatedComponent
  implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  @ViewChild(containerElementName, { static: false }) containerRef: ElementRef;
  @Input() value: string;

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
    if (this.containerRef) {
      ReactDOM.render(
        <AnimateShowAndHide children={this.value} />,
        this.containerRef.nativeElement
      );
    }
  }
}
