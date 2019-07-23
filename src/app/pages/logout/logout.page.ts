import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
})
export class LogoutPage implements OnInit {

  constructor(
    public afAuth: AngularFireAuth,
    public router: Router,
    private user: UserService) {
    this.user.setUser({ username: '', uid: '' })
    firebase.auth().signOut().then(() => {
      this.router.navigate(['/login'], { queryParams: { 'refresh': Date.now() } });
    })
      .catch(err => {
        console.log(err);
      });
    this.router.navigate(['/tabs'], { queryParams: { 'refresh': Date.now() } });
  }

  ngOnInit() {
  }

}
