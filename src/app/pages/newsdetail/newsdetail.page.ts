import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService, Post } from 'src/app/post.service';
import { AngularFirestoreDocument } from '@angular/fire/firestore';
import * as firebase from 'firebase';


@Component({
  selector: 'app-newsdetail',
  templateUrl: './newsdetail.page.html',
  styleUrls: ['./newsdetail.page.scss'],
})
export class NewsdetailPage implements OnInit {
  kontrol = firebase.auth().currentUser
  public post: any = {
    id:0
  };

  commentContent: String;
  postId: String;
  fetchPost: AngularFirestoreDocument;

  constructor(private activatedRoute: ActivatedRoute, private postService:PostService) { }
  ngOnInit() {
    this.postId = this.activatedRoute.snapshot.paramMap.get('id');
    this.fetchPost = this.postService.getPostsById(this.postId);

    this.postService.incPostView(this.fetchPost);

    this.fetchPost.valueChanges().subscribe(post=>{
      this.post = post;
    });
    
  }
  postComment(){
    this.postService.addComment(this.postId,this.post.comments,this.commentContent);
    this.commentContent="";
  }

}
