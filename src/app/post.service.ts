import {Injectable} from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as Long from 'long';
import { DomEventsPlugin } from '@angular/platform-browser/src/dom/events/dom_events';
import { User } from 'firebase';
import { UserService } from './user.service';

export interface Post {
    desc: string,
    post_title: string,
    image: string,
    owner_id: string,
    owner_username: string,
    cat_of_post: string,
    view:number,
    comments: Comment[]
}
export interface PostId extends Post{
    id:string;
}
export interface Comment{
    owner: any,
    content:String,
    date: String
}
@Injectable({
    providedIn: 'root'
  })
export class PostService {
    private post: Post;
    private postCollection: AngularFirestoreCollection<Post>;
    posts: Observable<PostId[]>;
    
    constructor(private userService: UserService, private afs:AngularFirestore){
        
    }
    
    getPosts(){
        this.postCollection = this.afs.collection<Post>("posts");
       
        this.posts = this.postCollection.snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Post;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
      return this.posts;
    }
    
    getPostsById(id){
       return this.afs.collection('posts').doc(id);
    }

    incPostView(doc: AngularFirestoreDocument){
        var currentView = 0;
        var justfirsttime = false;
        doc.valueChanges()
        .subscribe(singleleDoc=>{
            currentView = singleleDoc.view;
            if(!justfirsttime){
                justfirsttime=true;
                doc.update({
                view:++currentView
            });
        }    
        });
    }

    updatePost(id,post:Post){
        this.afs.doc(`posts/${id}`).update(post);
    }
    setPost(_desc,_post_title,_image_url,_owner_id,_owner_username,_cat_of_post){
        let post: Post={
            owner_id: _owner_id,
            owner_username: _owner_username,
            image: _image_url,
            post_title: _post_title,
            desc: _desc,
            cat_of_post: _cat_of_post,
            view:0,
            comments:[]
        };

        return this.post = post;
    }

    async addComment(id: String, allComments: Comment[], comment: String){
        var dateObj = new Date();
        var time = dateObj.toTimeString().split(' ')[0];
        var date = dateObj.toISOString().split('T')[0];

        let newComment:Comment ={
            owner:this.userService.getUser(),
            content: comment,
            date:time+'/'+date
        }
        allComments.push(newComment);
        await this.afs.doc(`posts/${id}`).update({comments: allComments});
    }

    getUID(){
        return this.post.owner_id;
    }

    setOwnerId(ownerid: string){
        this.post.owner_id=ownerid;
    }

    getOwnerId(){
        return this.post.owner_id;
    }

}