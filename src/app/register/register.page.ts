import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Router } from '@angular/router';

import { AlertController } from '@ionic/angular';

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
    public router: Router
  ) { }

  ngOnInit() {
  }

  async register() {
    const { username, password, cpassword } = this;
    if (password !== cpassword) {
      this.ShowAlert("Error!", "Passwords don't match!");
      return console.error("Passwords don't match!");
    }
    try {
      const res = await this.afAuth.auth.createUserWithEmailAndPassword(username, password);
      console.log(res);
      this.ShowAlert("Success!", "Welcome abroad!");
      this.router.navigate(['/']);
    } catch (error) {
      console.dir(error);
      this.ShowAlert("Error!", error.message);
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
