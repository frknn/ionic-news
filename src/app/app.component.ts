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
  public appPages = [];
  /*
    if you use sub item, you must add some element like below
  {
    title: 'Kategoriler',
    children:[
      {
        title:'Ionic',
        url:'test/test',
        icon:'logo-ionic'
      },
      {
        title:'Google',
        url:'test/test',
        icon:'logo-google'
      }
    ]
  } */
  isLogin = false;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public afAuth: AngularFireAuth
  ) {
    this.initializeApp();
    var self = this;
    function generateMenu(){
      self.afAuth.authState.subscribe(res => {
        self.appPages = []; //clear menu

        self.appPages.push({title: "Home",url: "/home",icon: "home"}); // joint menu items
        self.appPages.push({
          title: 'Kategoriler',
          children:[
            {
              title:'Ionic',
              url:'test/test',
              icon:'logo-ionic'
            },
            {
              title:'Google',
              url:'test/test',
              icon:'logo-google'
            }
          ]
        });
        if (res && res.uid) { // Here is working while user logged
          self.isLogin = true;
          self.appPages.push({title:"Profil",url:"/profile",icon:"person"});
          self.appPages.push({title:"Çıkış",url:"/logout",icon:"log-out"});
        }else{ // türkçe lan türkçe
          self.appPages.push({title:"Giriş Yap",url:"/login",icon:"log-in"});
        }
      });
    }
    generateMenu();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
