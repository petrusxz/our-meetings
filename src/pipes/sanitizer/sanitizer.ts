import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'sanitize',
})
export class SanitizerPipe implements PipeTransform {
  
  constructor(private sanitizer: DomSanitizer) { }
  
  transform(value: string) : SafeHtml {
    return this.sanitizer.bypassSecurityTrustUrl(value);
  }
}
