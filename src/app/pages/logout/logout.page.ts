import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
})
export class LogoutPage implements OnInit {

  constructor(public afAuth: AngularFireAuth,
    public router: Router) {
    firebase.auth().signOut();
    this.router.navigate(['/tabs']);
  }

  ngOnInit() {
  }

}
