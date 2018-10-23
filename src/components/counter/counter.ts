import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'counter',
  templateUrl: 'counter.html'
})
export class CounterComponent {
  
  value: number = 0;
  @Output() updateValue = new EventEmitter<number>();

  increaseValue(): void {
    if (this.value <= 20) {
      this.value++;
      this.updateValue.emit(this.value);
    }
  }

  decreaseValue(): void {
    if (this.value !== 0) { 
      this.value--;
      this.updateValue.emit(this.value);
    }
  }
}
