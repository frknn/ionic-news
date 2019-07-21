import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { PostService } from '../post.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  userPosts = [];
  
  $_route$: Subscription;

  constructor(private afs: AngularFirestore, private user: UserService,private router:Router, private posts: PostService) {
   /*  this.afs.collection('posts').valueChanges().subscribe(postlar => {
      this.userPosts = postlar;
    }); */
  
    
  }
  goDetails(id){
      this.router.navigate(['/newsdetail/'+id]);
  }
  ngOnInit() {
    const datas = this.posts.getPosts().subscribe(posts=>{
      this.userPosts = posts;
    });
  }

}