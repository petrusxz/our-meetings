import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-auth-modal',
  templateUrl: 'auth-modal.html',
})
export class AuthModalPage {

  private actionCodeSettings = {
    url: 'http://localhost:8100/#/home',
    handleCodeInApp: true,
    iOS: {
      bundleId: 'com.ourmeetings'
    },
    android: {
      packageName: 'com.ourmeetings',
      installApp: true,
      minimumVersion: '1.0'
    }
  };

  // tslint:disable-next-line:max-line-length
  private emailValidator: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  private user: { email: string, password: string };
  private signInForm: FormGroup;

  constructor(
    public viewCtrl: ViewController,
    private formBuilder: FormBuilder,
    private afAuth: AngularFireAuth
  ) {
    this.validationForm();
  }

  validationForm(): void {
    this.signInForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.pattern(this.emailValidator), Validators.required])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    });
  }

  async signIn(): Promise<void> {
    if (!this.signInForm.valid) {
      this.signInForm.markAsPending();
      return;
    }

    this.user = this.signInForm.value;

    try {
      // await this.afAuth.auth.sendSignInLinkToEmail(this.user.email, this.actionCodeSettings);
      await this.afAuth.auth.signInWithEmailAndPassword(this.user.email, this.user.password);
      this.viewCtrl.dismiss();
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        this.signUp();
      }
      console.error(error);
    }
  }

  async signUp(): Promise<void> {
    try {
      await this.afAuth.auth.createUserWithEmailAndPassword(this.user.email, this.user.password);
      this.viewCtrl.dismiss();
    } catch (error) {
      console.error(error);
    }
  }
}
