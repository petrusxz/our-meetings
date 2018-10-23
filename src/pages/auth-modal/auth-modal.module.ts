import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AuthModalPage } from './auth-modal';

@NgModule({
  declarations: [
    AuthModalPage,
  ],
  imports: [
    IonicPageModule.forChild(AuthModalPage),
  ],
})
export class AuthModalPageModule {}
