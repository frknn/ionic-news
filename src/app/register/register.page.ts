import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Router } from '@angular/router';

import { AlertController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from '../user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  username: string = "";
  password: string = "";
  cpassword: string = "";

  constructor(
    public afAuth: AngularFireAuth,
    public alertController: AlertController,
    public router: Router,
    public afstore: AngularFirestore,
    public user: UserService
  ) { }

  ngOnInit() {
  }

  async register() {
    const { username, password, cpassword } = this;
    if (password !== cpassword) {
      // this.ShowAlert("Error!", "Passwords don't match!");
      return console.error("Passwords don't match!");
    }
    try {
      const res = await this.afAuth.auth.createUserWithEmailAndPassword(username, password);
      console.log(res);

      this.afstore.doc(`users/${res.user.uid}`).set({
        username
      })

      this.user.setUser({
        username,
        uid: res.user.uid
      })

      this.ShowAlert("Success!", "Welcome abroad!");
      this.router.navigate(['/tabs']);


    } catch (error) {
      console.dir(error);
      // this.ShowAlert("Error!", error.message);
    }
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
