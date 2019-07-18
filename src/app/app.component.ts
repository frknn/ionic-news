import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import * as firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [
  {
    title: 'Home',
    url: '/home',
    icon: 'home'
  }
];
  isLogin = false;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public afAuth: AngularFireAuth
  ) {
    this.initializeApp();
    this.afAuth.authState.subscribe(res => {
      if (res && res.uid) {
        this.isLogin = true;
        this.appPages.push({title:"Profil",url:"/profile",icon:"person"});
        this.appPages.push({title:"Çıkış",url:"/logout",icon:"log-out"});
      }else{
        this.appPages.push({title:"Giriş Yap",url:"/login",icon:"log-in"});
      }
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
