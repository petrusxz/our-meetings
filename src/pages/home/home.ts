import { Component, ViewChild, ChangeDetectorRef, HostBinding } from '@angular/core';
import { IonicPage, NavController, NavParams, InfiniteScroll, Content } from 'ionic-angular';
import { Observable, Subject, Subscription, interval } from 'rxjs';
import {
  scan, map, take, startWith, distinctUntilChanged,
  filter, pairwise, share, throttleTime
} from 'rxjs/operators';
import { AngularFirestoreCollection, AngularFirestore, QueryDocumentSnapshot } from 'angularfire2/firestore';
import { MeetingModel } from '../../models/meeting.model';
import { AngularFireAuth } from 'angularfire2/auth';

enum Direction {
  Up = 'up',
  Down = 'down'
}

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  items = new Array(40);
  @ViewChild(Content) content: Content;

  private isVisible = true;

  private meetings: Observable<MeetingModel[]>;
  private meetingCollection: AngularFirestoreCollection<MeetingModel>;

  private list$ = new Subject<MeetingModel[]>();
  private meetingCollectionCursor: QueryDocumentSnapshot<MeetingModel>;

  private listEnd: boolean = false;

  private obsSlideTopics = new Subscription();
  private previewTopics: string = null;
  private activeMeeting: string = null;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private cd: ChangeDetectorRef
  ) {
    this.initialize();
  }

  ionViewDidLoad(): void {
    this.stickyHeader();
  }

  initialize(): void {
    this.meetingCollection = this.afs.collection<MeetingModel>('meeting', ref => ref
      .orderBy('date', 'desc')
      .limit(6));

    this.meetings = this.list$.pipe(
      scan((list, newValues) => list.concat(newValues))
    );

    this.fetchMeetings()
      .subscribe((data) => this.updateMeetingList(data));
  }

  updateMeetingList(data: MeetingModel[]): void {
    this.listEnd = !data.length;
    this.list$.next(data);
  }

  fetchMeetings(): Observable<MeetingModel[]> {
    return this.meetingCollection.snapshotChanges()
      .pipe(
        map(res => res.map(snap => {
          const data = snap.payload.doc.data() as MeetingModel;
          this.meetingCollectionCursor = snap.payload.doc;
          return data;
        })),
        take(1)
      );
  }

  loadMoreMeetings(event: InfiniteScroll): void {
    if (this.listEnd) {
      return event.complete();
    }

    this.meetingCollection = this.afs.collection<MeetingModel>('meeting', ref => ref
      .orderBy('date', 'desc')
      .limit(6)
      .startAfter(this.meetingCollectionCursor));

    this.fetchMeetings()
      .subscribe((data) => {
        this.updateMeetingList(data);
        event.complete();
      });
  }

  slideTopics(meeting: MeetingModel): void {
    this.stopTopicsSlide();
    this.activeMeeting = meeting.id;

    const obs = interval(2000).pipe(
      startWith(0),
      scan(x => x + 1),
      map(count => count % meeting.topics.length),
      map(index => {
        this.previewTopics = meeting.topics[index];
      })
    );
    this.obsSlideTopics = obs.subscribe();
  }

  stopTopicsSlide(): void {
    this.previewTopics = null;
    this.activeMeeting = null;
    this.obsSlideTopics.unsubscribe();
  }

  stickyHeader(): void {
    const scroll$ = this.content.ionScroll.pipe(
      throttleTime(10),
      map(() => this.content.directionY),
      distinctUntilChanged(),
      share()
    );

    const goingUp$ = scroll$.pipe(
      filter(direction => direction === Direction.Up)
    );

    const goingDown$ = scroll$.pipe(
      filter(direction => direction === Direction.Down)
    );

    goingUp$.subscribe(() => {
      this.isVisible = true;
      this.cd.detectChanges();
    });
    goingDown$.subscribe(() => {
      this.isVisible = false;
      this.cd.detectChanges();
    });
  }

  navToMeeting(meeting: MeetingModel = null): void {
    this.navCtrl.push('MeetingPage', { data: meeting });
  }

  signOut(): void {
    this.afAuth.auth.signOut();
  }
}
