import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MeetingModel } from '../../models/meeting.model';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { ActionEnum } from '../../models/action-enum.model';

@IonicPage()
@Component({
  selector: 'page-meeting',
  templateUrl: 'meeting.html',
})
export class MeetingPage {

  private actionEnum = ActionEnum;
  private meeting: MeetingModel;
  private currentUser: firebase.User;
  private action: number;
  private meetingCollection: AngularFirestoreCollection<MeetingModel>;
  private meetingDoc: AngularFirestoreDocument<MeetingModel>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore
  ) {
    this.initialize();
  }

  initialize(): void {
    this.meeting = new MeetingModel(this.navParams.data);
    this.currentUser = this.afAuth.auth.currentUser;
    this.action = !this.meeting.id ? ActionEnum.Create : this.setMeetingAction();
    this.meetingCollection = this.afs.collection<MeetingModel>('meeting');
  }

  setMeetingAction(): number {
    if (this.currentUser.email === this.meeting.createdBy) {
      return ActionEnum.Delete;
    } else if (this.meeting.users.indexOf(this.currentUser.email) === -1) {
      return ActionEnum.Join;
    } else {
      return ActionEnum.Leave;
    }
  }

  async openFile(event: any): Promise<void> {
    const file = event.target.files[0];

    if (file.type.split('/')[0] !== 'image') {
      console.error('File type not supported.');
      return;
    }

    const reader = new FileReader();

    reader.onload = e => {
      const base64 = reader.result as string;
      this.meeting.image = base64;
    };

    reader.readAsDataURL(file);
  }

  async createMeeting(): Promise<void> {
    this.meeting.createdBy = this.currentUser.email;
    this.meeting.id = this.meeting.id || this.afs.createId();

    try {
      await this.saveMeeting();
      this.meeting = new MeetingModel();
    } catch (error) {
      console.error(error);
    }
  }

  async joinMeeting(): Promise<void> {
    const idxUser = this.meeting.users.indexOf(this.currentUser.email);

    if (idxUser === -1) {
      this.meeting.users.push(this.currentUser.email);

      try {
        await this.saveMeeting();
        this.action = this.setMeetingAction();
      } catch (error) {
        console.error(error);
      }
    }
  }

  async leaveMeeting(): Promise<void> {
    this.meeting.users = this.meeting.users.filter(el => el !== this.currentUser.email);

    try {
      await this.saveMeeting();
      this.navCtrl.pop();
    } catch (error) {
      console.error(error);
    }
  }

  saveMeeting(): Promise<void> {
    return this.meetingCollection
      .doc(this.meeting.id)
      .set(Object.assign({}, this.meeting));
  }
}
