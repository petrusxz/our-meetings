import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MeetingPage } from './meeting';
import { PipesModule } from '../../pipes/pipes.module';
import { ComponentsModule } from '../../components/components.module';
import {IonTagsInputModule} from 'ionic-tags-input';

@NgModule({
  declarations: [
    MeetingPage,
  ],
  imports: [
    IonicPageModule.forChild(MeetingPage),
    PipesModule,
    ComponentsModule,
    IonTagsInputModule
  ],
})
export class MeetingPageModule {}
