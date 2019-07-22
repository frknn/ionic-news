import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  userPosts = [];
  
  $_route$: Subscription;

  constructor(private afs: AngularFirestore, private user: UserService,private router:ActivatedRoute) {
    this.afs.collection('posts').valueChanges().subscribe(postlar => {
      this.userPosts = postlar;
    });
  }

  ngOnInit() {
    /* try{
    console.log(this.router.routerState);
    }catch(e){} */
  }

}
