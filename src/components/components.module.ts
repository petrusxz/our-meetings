import { NgModule } from '@angular/core';
import { CounterComponent } from './counter/counter';
import { IonicApp, IonicModule } from 'ionic-angular';

@NgModule({
	declarations: [
		CounterComponent,
	],
	imports: [
		IonicModule
	],
	bootstrap: [IonicApp],
	exports: [
		CounterComponent,
	]
})
export class ComponentsModule { }
