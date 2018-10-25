import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'emoji',
})
export class EmojiPipe implements PipeTransform {
 
  transform(value: number) {
    return String.fromCodePoint(value);
  }
}
