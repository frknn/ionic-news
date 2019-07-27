import { Component, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http'
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { firestore } from 'firebase';
import * as firebase from 'firebase';
import { first } from 'rxjs/operators';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { PostService } from '../post.service';


@Component({
  selector: 'app-upload',
  templateUrl: './upload.page.html',
  styleUrls: ['./upload.page.scss'],
})
export class UploadPage implements OnInit {

  ionViewWillEnter(){
    if (!firebase.auth().currentUser) {
      this.ShowAlert("Hata", "Haber oluşturabilmek için giriş yapmanız gerekiyor");
      this.router.navigate(['/home/home']);
    }
  }

  imageKey: string;
  desc: string;
  posttitle: string;
  posts1 = [];
  categories = [];
  selectedcat;
  takenimg;
  postid1: string;
  storageRef = firebase.storage();
  current_datetime = new Date();


  @ViewChild('fileBtn') fileButton

  constructor(
    public http: Http,
    public afstore: AngularFirestore,
    public alertController: AlertController,
    public user: UserService,
    private camera: Camera,
    public router: Router,
    private afAuth: AngularFireAuth,
    public postService: PostService,
    private loadingController: LoadingController
  ) {

  }


  ngOnInit() {
    // TODO: herşey okay ama router bi kez çalışıyor
    // if(!this.user.isAuthenticated()){
    //  this.ShowAlert("Hata","Haber oluşturabilmek için giriş yapmanız gerekiyor");
    //  this.router.navigate(['/tabs']);
    // if (!firebase.auth().currentUser) {
    //   this.ShowAlert("Hata", "Haber oluşturabilmek için giriş yapmanız gerekiyor");
    //   this.router.navigate(['/login']);
    // }
    this.afstore.collection('categories').valueChanges().subscribe(category => {
      this.categories = category;
    });
  }


  async takePicture() {
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    await this.camera.getPicture(options).then((imageData) => {
      this.imageKey = '';
      this.takenimg = imageData;
    }, (err) => {
      console.log("Camera issue:" + err);
    });

    this.loadingController.dismiss();
    this.storageRef.ref(`pictures/upload/${'mypics' + '#' + this.current_datetime.getTime()}`)
      .putString('data:image/jpeg;base64,' + this.takenimg, firebase.storage.StringFormat.DATA_URL)
      .then(snapshot => {
        return snapshot.ref.getDownloadURL();
      })
      .then(downloadURL => {
        alert(downloadURL);
        this.loadingController.dismiss();
        return this.imageKey = downloadURL;
      })
      .catch(err => {
        alert(err);
      })
  }

  async fileChanged(event) {
    const file = event.target.files[0];

    this.presentLoading();
    this.storageRef
      .ref(`pictures/upload/${file.name + '#' + this.current_datetime.getTime()}`)
      .put(file)
      .then(snapshot => {
        return snapshot.ref.getDownloadURL();
      })
      .then(downloadURL => {
        this.loadingController.dismiss();
        this.imageKey = downloadURL;
      })
  }

  async createPost() {
    this.presentLoading();
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
  await this.afstore.collection('posts').add(post)
      .then(res => {
        this.postid1 = res.id; //kullanıcının postlarını belirlemek için
      this.loadingController.dismiss();
        this.router.navigate(['/newsdetail/' + this.postid1]);
      });



    const postid = this.postid1;

    this.afstore.doc(`users/${this.user.getUID()}`).update({
      posts: firestore.FieldValue.arrayUnion({
        postid
      })
    })
    this.imageKey = '';
    this.desc = '';
    this.posttitle = '';
    this.selectedcat = '';

    this.router.navigate(['/newsdetail/' + this.postid1]);
  }

  uploadFile() {
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
  
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Yükleniyor...'
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    this.loadingController.dismiss();
  }
}
