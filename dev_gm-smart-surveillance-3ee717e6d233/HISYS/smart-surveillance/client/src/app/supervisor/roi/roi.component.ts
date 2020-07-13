import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Params} from "@angular/router";
import {drawCanvas, removeCanvas, clearCanvasX} from './label';
import {Observable} from "rxjs";
import {Curve} from "./curve";
import { Modal, BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';


@Component({
  moduleId: module.id.toString(),
  templateUrl: 'roi.component.html',
  providers: [Modal]
})
export class ROIComponent implements OnInit {
  imageId: number;
  imageIds: number[];
  prev: number;
  next: number;
  editingMode: boolean = false;
  curve: Curve;

  constructor(
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    
  }

  public activateEditingMode() {
    this.editingMode = true;
    this.curve = drawCanvas();
  }

  public deactivateEditingMode() {
    this.editingMode = false;
    removeCanvas();
  }

  public clearCanvas(){
    // TODO: This should just clear the canvas
    removeCanvas();
    drawCanvas();
  }

  public submitAnnotation(){
    console.log(JSON.stringify(this.curve._path));
    this.deactivateEditingMode();
  }

  private setPrevNext() {
    let index = this.imageIds.indexOf(this.imageId);
    this.prev = this.imageIds[this.mod((index - 1), this.imageIds.length)];
    this.next = this.imageIds[this.mod((index + 1), this.imageIds.length)];
  }

  mod(n: number, m: number): number {
    return ((n % m) + m) % m;
  }
}
