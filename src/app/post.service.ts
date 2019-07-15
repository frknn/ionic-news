import {Injectable} from '@angular/core';

interface Post {
    desc: string,
    imagekey: string,
    uid: string,
    ownerid: string
}

@Injectable()
export class PostService {
    private post: Post;

    constructor(){

    }

    setPost(post: Post){
        this.post = post;
    }

    getUID(){
        return this.post.uid;
    }

    setOwnerId(ownerid: string){
        this.post.ownerid=ownerid;
    }

    getOwnerId(){
        return this.post.ownerid;
    }
}