import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService, Post } from 'src/app/post.service';

@Component({
  selector: 'app-newsdetail',
  templateUrl: './newsdetail.page.html',
  styleUrls: ['./newsdetail.page.scss'],
})
export class NewsdetailPage implements OnInit {
  public post: any = {
    id:0
  };


  constructor(private activatedRoute: ActivatedRoute, private postService:PostService) { }
  private postId;
  ngOnInit() {
    this.postId = this.activatedRoute.snapshot.paramMap.get('id');
    let fetchPost = this.postService.getPostsById(this.postId);

    this.postService.incPostView(fetchPost);

    fetchPost.valueChanges().subscribe(post=>{
      this.post = post;
    });
    
  }

}
