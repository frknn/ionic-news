import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from 'src/app/post.service';

@Component({
  selector: 'app-categorynews',
  templateUrl: './categorynews.page.html',
  styleUrls: ['./categorynews.page.scss'],
})
export class CategorynewsPage implements OnInit {

  private categoryId;
  private posts;
  private categoryName;
  constructor(private router:Router,private activatedRoute:ActivatedRoute, private postService: PostService) { }

  ngOnInit() {
    this.categoryId = this.activatedRoute.snapshot.paramMap.get('id');
    const datas = this.postService.getPostByCat(this.categoryId).subscribe(values=>{
      this.posts = values;
      this.categoryName = this.posts[0].cat_of_post.category_title;
    });
  }
  goDetails(id){
      this.router.navigate(['/newsdetail/'+id]);
  }

}
