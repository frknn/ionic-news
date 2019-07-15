import { Component, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http'
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { firestore, User } from 'firebase';
import * as firebase from 'firebase';


@Component({
  selector: 'app-upload',
  templateUrl: './upload.page.html',
  styleUrls: ['./upload.page.scss'],
})
export class UploadPage implements OnInit {

  imageKey: string;
  desc: string;
  posts1 = [];
  postid1: string;
  storageRef = firebase.storage();
  current_datetime = new Date();


  @ViewChild('fileBtn') fileButton

  constructor(
    public http: Http,
    public afstore: AngularFirestore,
    public user: UserService,
  ) { }

  ngOnInit() {
  }

  async fileChanged(event) {
    const file = event.target.files[0];
    const filestr = event.target.result;
    console.log(file.name);

    this.storageRef
    .ref(`pictures/upload/${file.name+ '#' + this.current_datetime.getTime()}`)
    .put(file)
    .then(snapshot => {
      return snapshot.ref.getDownloadURL();
    })
    .then(downloadURL => {
      console.log(downloadURL);
      this.imageKey = downloadURL;
    })




    // const data = new FormData();
    // data.append('file', file);
    // data.append('UPLOADCARE_STORE', '1');
    // data.append('UPLOADCARE_PUB_KEY', 'e391c25c2efed3c13041');

    // await this.http.post('https://upload.uploadcare.com/base/', data)
    //   .subscribe(event => {
    //     // console.log(event);
    //     this.imageKey = event.json().file;
    //   })
  }

  async createPost() {

    const image = this.imageKey;
    const desc = this.desc;

    // const ownerid = this.user.getUID();

    await this.afstore.collection('posts').add({ image, desc })
    .then(res => {
      this.postid1 = res.id;
      console.log("Response id: ", res.id)
    });

    this.afstore.doc(`posts/${this.postid1}`).update({
      owner_id: this.user.getUID(),
      owner_mail: this.user.getUsername()
    })

    const postid = this.postid1;

    this.afstore.doc(`users/${this.user.getUID()}`).update({
      posts: firestore.FieldValue.arrayUnion({
        postid
      })
    })

    var docRef = this.afstore.collection('posts');

    await docRef.get().subscribe(posts2 => {
      if (!posts2.empty) {
        posts2.forEach(doc => {
          console.log(doc)
          this.posts1.push(doc.data());
        })
      } else {
        console.log("No such doc!");
      }
    }, err => {
      console.log("Error getting doc: ", err)
    })

    this.imageKey = '';
  }

  uploadFile(){
    this.fileButton.nativeElement.click()
  }
}
