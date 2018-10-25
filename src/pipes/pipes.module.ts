import { NgModule } from '@angular/core';
import { SanitizerPipe } from './sanitizer/sanitizer';
import { EmojiPipe } from './emoji/emoji';

@NgModule({
	declarations: [
		SanitizerPipe,
		EmojiPipe
	],
	imports: [],
	exports: [
		SanitizerPipe,
		EmojiPipe
	]
})
export class PipesModule { }
