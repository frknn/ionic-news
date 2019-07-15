import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from '../user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  userPosts = [];
  newPosts = []

  constructor(private afs: AngularFirestore, private user: UserService) {
    this.afs.collection('posts').valueChanges()
      .subscribe(posts3 => {
        // this.userPosts.push(posts3);
        if (posts3) {
          // posts3.forEach(p => {
          //     console.log(p)
          //     this.userPosts.push(p);
          // })
          // this.userPosts.push(posts3[posts3.length-1])
          // console.log(posts3[posts3.length - 1]);
          this.userPosts = [];
          posts3.forEach(p => {
            console.log(p);
            this.userPosts.push(p);
            // console.log("newPosts=", this.newPosts);
            // this.userPosts = this.newPosts;
          })

        } else {
          console.log("Couldn't get posts!");
        }
      }, err => {
        console.log(err);
      })
  }

  ngOnInit() {
  }

}
