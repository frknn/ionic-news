import { Component, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http'
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { firestore, User } from 'firebase';
import * as firebase from 'firebase';
import { first } from 'rxjs/operators';


@Component({
  selector: 'app-upload',
  templateUrl: './upload.page.html',
  styleUrls: ['./upload.page.scss'],
})
export class UploadPage implements OnInit {

  imageKey: string;
  desc: string;
  posttitle: string;
  posts1 = [];
  categories=[];
  selectedcat;
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
    this.afstore.collection('categories').valueChanges().subscribe(category => {
      this.categories = category;
      });
      console.log(this.categories);
    }


  async fileChanged(event) {
    const file = event.target.files[0];
    console.log(file.name); // kalkacak

    this.storageRef
    .ref(`pictures/upload/${file.name+ '#' + this.current_datetime.getTime()}`)
    .put(file)
    .then(snapshot => {
      return snapshot.ref.getDownloadURL();
    })
    .then(downloadURL => {
      console.log(downloadURL);//kaldırılacak
      this.imageKey = downloadURL;
    })
  }

  async createPost() {

   

    const image = this.imageKey;
    const desc = this.desc;
    const post_title = this.posttitle;
    const cat_of_post = this.selectedcat;
 
    // const ownerid = this.user.getUID();

    await this.afstore.collection('posts').add({ image, desc, post_title, cat_of_post })
    .then(res => {
      this.postid1 = res.id; //kullanıcının postlarını belirlemek için
      console.log("Response id(Post id): ", res.id)//kalkacak
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

    // eski post pushlama kodu
    // await docRef.get().subscribe(posts2 => {
    //   if (!posts2.empty) {
    //     posts2.forEach(doc => {
    //       console.log(doc)
    //       this.posts1.push(doc.data());
    //     })
    //   } else {
    //     console.log("No such doc!");
    //   }
    // }, err => {
    //   console.log("Error getting doc: ", err)
    // })

    this.imageKey = '';
    this.desc='';
    this.posttitle='';
    this.selectedcat='';
  }

  uploadFile(){
    this.fileButton.nativeElement.click()
  }
}
