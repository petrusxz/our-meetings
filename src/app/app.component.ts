import { Component } from '@angular/core';
import { Platform, ModalOptions, ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: string = 'HomePage';

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private afAuth: AngularFireAuth,
    private modalCtrl: ModalController
  ) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
      this.checkAuth();
    });
  }

  checkAuth(): void {
    this.afAuth.authState
      .subscribe(async (user) => {

        if (!user) {
          const myModalOptions: ModalOptions = {
            enableBackdropDismiss: false,
            cssClass: 'modal-custom'
          };
          
          const modal = this.modalCtrl.create('AuthModalPage', null, myModalOptions)
          return modal.present();
        }

        await this.afAuth.auth.updateCurrentUser(user);
      });
  }
}

