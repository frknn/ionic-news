import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import {Router} from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  username: string = "";
  password: string = "";

  constructor(
    public afAuth: AngularFireAuth,
    public router: Router,
    public alertController: AlertController,
    public user:UserService
    ) { }

  ngOnInit() {
  }

  async login() {

    const { username, password } = this;
    try {
      const constEmail = "@mub.com";
      let usernameWmail = username+constEmail;
      const res = await this.afAuth.auth.signInWithEmailAndPassword(usernameWmail, password);
      if (res.user) {
        this.user.setUser({
          username,
          uid: res.user.uid
        });
        this.router.navigate(['/tabs']);
      }
    } catch (err) {
      switch(err.code){
        case "auth/wrong-password":
          this.ShowAlert("Error!", "Kullanıcı adı veya şifre yanlış");
          break;
          case "auth/user-not-found":
            this.ShowAlert("Error!", "Kullanıcı adı veya şifre yanlış");
            console.dir(err);
            break;
          case "auth/invalid-email":
            this.ShowAlert("Error!", "Kullanıcı adı veya şifre yanlış");
            console.dir(err);
            break;
        default:
          console.dir(err);
          break;
      }
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
