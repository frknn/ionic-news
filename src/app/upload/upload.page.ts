import { Component, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http'
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { firestore, User } from 'firebase';
import * as firebase from 'firebase';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { PostService } from '../post.service';


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
    public alertController: AlertController,
    public user: UserService,
    public postService: PostService,
    public router: Router
  ) { 
  }

  ngOnInit() {    
    // TODO: herşey okay ama router bi kez çalışıyor
    if(!this.user.isAuthenticated()){
     this.ShowAlert("Hata","Haber oluşturabilmek için giriş yapmanız gerekiyor");
     this.router.navigate(['/tabs']);
   }


    this.afstore.collection('categories').valueChanges().subscribe(category => {
      this.categories = category;
      });
    }

  async fileChanged(event) {
    const file = event.target.files[0];

    this.storageRef
    .ref(`pictures/upload/${file.name+ '#' + this.current_datetime.getTime()}`)
    .put(file)
    .then(snapshot => {
      return snapshot.ref.getDownloadURL();
    })
    .then(downloadURL => {
      this.imageKey = downloadURL;
    })
  }

  async createPost() {
    const image = this.imageKey;
    const desc = this.desc;
    const post_title = this.posttitle;
    const cat_of_post = this.selectedcat;
    const view = 0;
    let post = this.postService.setPost(desc,
      post_title,
      image,
      this.user.getUID(),
      this.user.getUsername(),
      cat_of_post);
    // const ownerid = this.user.getUID();

    await this.afstore.collection('posts').add(post)
    .then(res => {
      this.postid1 = res.id; //kullanıcının postlarını belirlemek için
      this.router.navigate(['/newsdetail/'+this.postid1]);
    });

   /*  this.afstore.doc(`posts/${this.postid1}`).update({
      owner_id: this.user.getUID(),
      owner_username: this.user.getUsername()
    }) */

    const postid = this.postid1;

    this.afstore.doc(`users/${this.user.getUID()}`).update({
      posts: firestore.FieldValue.arrayUnion({
        postid
      })
    })
/* 
    var docRef = this.afstore.collection('posts');
 */
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
/* 
    this.imageKey = '';
    this.desc='';
    this.posttitle='';
    this.selectedcat=''; */

    this.router.navigate(['/newsdetail/'+this.postid1]);
  }

  uploadFile(){
    this.fileButton.nativeElement.click()
  }
  async ShowAlert(header: string, message: string) {
      const alert = await this.alertController.create({
        header,
        message,
        buttons: ["OK!"]
      })
  
      await alert.present();
  }
}
