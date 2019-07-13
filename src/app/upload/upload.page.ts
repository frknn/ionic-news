import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http'
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { firestore, User } from 'firebase';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.page.html',
  styleUrls: ['./upload.page.scss'],
})
export class UploadPage implements OnInit {

  imageKey: string;
  desc: string;
  posts: []

  constructor(
    public http: Http,
    public afstore: AngularFirestore,
    public user: UserService,
    ) { }

  ngOnInit() {
  }

  fileChanged(event){
    const files = event.target.files;
    console.log(files);

    const data = new FormData();
    data.append('file',files[0]);
    data.append('UPLOADCARE_STORE','1');
    data.append('UPLOADCARE_PUB_KEY','e391c25c2efed3c13041');

    this.http.post('https://upload.uploadcare.com/base/',data)
    .subscribe( event => {
      console.log(event);
      this.imageKey = event.json().file;
    })
  }

  createPost(){
    const image = this.imageKey;
    const desc = this.desc;

    this.afstore.doc(`users/${this.user.getUID()}`).update({
      posts: firestore.FieldValue.arrayUnion({
        image,desc
      })
    })

    var docRef = this.afstore.doc(`users/${this.user.getUID()}`);

    docRef.get().subscribe( doc => {
      if(doc.exists){
        console.log("Doc data is: ", doc.data().posts);
        this.posts = doc.data().posts;
      }else
      {
        console.log("No such doc!");
      }
    }, err => {
      console.log("Error getting doc: ", err)
    })
  }

}
