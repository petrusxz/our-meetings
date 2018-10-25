import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MeetingModel } from '../../models/meeting.model';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { ActionEnum } from '../../models/action-enum.model';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-meeting',
  templateUrl: 'meeting.html',
})
export class MeetingPage {

  private meetingForm: FormGroup;

  private actionEnum = ActionEnum;
  private meeting: MeetingModel;
  private currentUser: firebase.User;
  private action: number;
  private meetingCollection: AngularFirestoreCollection<MeetingModel>;
  private meetingDoc: AngularFirestoreDocument<MeetingModel>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
  ) {
    this.initialize();
    this.validationForm();
  }

  validationForm(): void {
    this.meetingForm = this.formBuilder.group({
      image: [this.meeting.image, Validators.required],
      title: [this.meeting.title, Validators.compose([Validators.required, Validators.minLength(6)])],
      date: [this.meeting.date, Validators.required],
      hour: [this.meeting.hour, Validators.required],
      limit: [''],
      topics: ['', Validators.required]
    }, { validator: checkLimit });

    if (this.meeting.id) {
      this.meetingForm.disable();
    }
  }

  initialize(): void {
    this.meeting = new MeetingModel(this.navParams.get('data') || {});
    this.meetingCollection = this.afs.collection<MeetingModel>('meeting');
    this.currentUser = this.afAuth.auth.currentUser;
    this.action = !this.meeting.id ? ActionEnum.Create : this.setMeetingAction();
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
      this.meetingForm.get('image').setValue(base64);
    };

    reader.readAsDataURL(file);
  }

  async createMeeting(): Promise<void> {
    if (!this.meetingForm.valid) {
      return;
    }

    this.meeting.createdBy = this.currentUser.email;
    this.meeting.id = this.meeting.id || this.afs.createId();
    this.meeting = Object.assign(this.meeting, this.meetingForm.value);

    try {
      await this.saveMeeting();
      this.navCtrl.pop();
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

  async deleteMeeting(): Promise<void> {
    try {
      await this.meetingCollection.doc(this.meeting.id).delete();
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

  onTopicsInput(event: Array<string>): void {
    this.meetingForm.get('topics').setValue(event);
  }
}

const checkLimit = (control: AbstractControl): { [key: string]: boolean } => {
  const limit = control.get('limit');

  return limit.value > 4 ? null : { minLimit: true };
};