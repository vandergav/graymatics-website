import { Pipe, PipeTransform } from '@angular/core';
/*
 * Raise the value of split string
*/
@Pipe({name: 'split'})
export class SplitString implements PipeTransform {
  transform(message: string): string[] {
    return message.split(' number');
  }
}