import { Component, Input } from '@angular/core';
import { AbstractControlDirective, AbstractControl } from '@angular/forms';

@Component({
  selector: 'show-errors',
  template: `
    <ul *ngIf="shouldShowErrors()">
      <li style="color: red" *ngFor="let error of listOfErrors()">{{error}}</li>
    </ul>
  `,
})
export class ShowErrorsComponent {

  private static readonly errorMessages = {
    'required': () => 'This field is required',
    'minlength': (params:any) => 'The min number of characters is ' + params.requiredLength,
    'maxlength': (params:any) => 'The max allowed number of characters is ' + params.requiredLength,
    'pattern': (params:any) => 'The required pattern is: ' + params.requiredPattern,
    'years': (params:any) => params.message,
    'countryCity': (params:any) => params.message,
    'uniqueName': (params:any) => params.message,
    'telephoneNumbers': (params:any) => params.message,
    'telephoneNumber': (params:any) => params.message
  };

  @Input()
  private control: AbstractControlDirective | AbstractControl;

  shouldShowErrors(): boolean {
    return this.control &&
      this.control.errors &&
      (this.control.dirty || this.control.touched);
  }

  listOfErrors(): string[] {
    return Object.keys(this.control.errors)
      .map(field => this.getMessage(field, this.control.errors[field]));
  }

  private getMessage(type: string, params: any) {
    return ShowErrorsComponent.errorMessages[type](params);
  }

}
