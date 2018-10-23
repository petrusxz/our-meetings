import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { MeetingModel } from '../../models/meeting.model';
import { AngularFireAuth } from 'angularfire2/auth';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  private meetings: Observable<MeetingModel[]>;
  private meetingCollection: AngularFirestoreCollection<MeetingModel>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {
    this.meetingCollection = this.afs.collection<MeetingModel>('meeting', ref => ref
      .orderBy('date', 'desc'));

    this.meetings = this.meetingCollection.valueChanges();
  }

  navToMeeting(): void {
    this.navCtrl.push('MeetingPage');
  }

  signOut(): void {
    this.afAuth.auth.signOut();
  }
}
