import { Injectable } from '@angular/core';
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
    view: number,
    comments: Comment[],
    date: String
}
export interface PostId extends Post {
    id: string;
}
export interface Comment {
    owner: any,
    content: String,
    date: String
}
export interface DateTime {
    hour: number,
    minute: number,
    year: number,
    month: number,
    day: number
}
@Injectable({
    providedIn: 'root'
})
export class PostService {
    private HOME_DESC_LENGT = 50;

    private post: Post;
    private postCollection: AngularFirestoreCollection<Post>;
    posts: Observable<PostId[]>;
    private dateObj = new Date();
    private dateTimeNow: DateTime;

    constructor(private userService: UserService, private afs: AngularFirestore) {
        this.dateTimeNow = this.setDateTime(this.dateTimeNow);
    }

    getPosts() {
        this.postCollection = this.afs.collection<Post>("posts");

        this.posts = this.postCollection.snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as Post;
                if(data.desc.length>this.HOME_DESC_LENGT){
                    data.desc = data.desc.substr(0,this.HOME_DESC_LENGT)+'...';
                }
                const getTimeData = this.convertReadableTime(data.date);
                const time = getTimeData["string"];
                const timeInt = getTimeData["int"];
                const id = a.payload.doc.id;
                return { id, time, timeInt, ...data };
            }).sort((a, b) => a.timeInt < b.timeInt ? -1 : a.timeInt > b.timeInt ? 1 : 0))
        );
        return this.posts;
    }

    getPostsById(id) {
        return this.afs.collection('posts').doc(id);
    }

    incPostView(doc: AngularFirestoreDocument) {
        var currentView = 0;
        var justfirsttime = false;
        doc.valueChanges()
            .subscribe(singleleDoc => {
                currentView = singleleDoc.view;
                if (!justfirsttime) {
                    justfirsttime = true;
                    doc.update({
                        view: ++currentView
                    });
                }
            });
    }

    updatePost(id, post: Post) {
        this.afs.doc(`posts/${id}`).update(post);
    }
    setPost(_desc, _post_title, _image_url, _owner_id, _owner_username, _cat_of_post) {
        var time = this.dateObj.toTimeString().split(' ')[0];
        var date = this.dateObj.toISOString().split('T')[0];

        let post: Post = {
            owner_id: _owner_id,
            owner_username: _owner_username,
            image: _image_url,
            post_title: _post_title,
            desc: _desc,
            cat_of_post: _cat_of_post,
            view: 0,
            comments: [],
            date: time + '/' + date
        };

        return this.post = post;
    }

    async addComment(id: String, allComments: Comment[], comment: String) {
        var time = this.dateObj.toTimeString().split(' ')[0];
        var date = this.dateObj.toISOString().split('T')[0];

        let newComment: Comment = {
            owner: this.userService.getUser(),
            content: comment,
            date: time + '/' + date
        }
        allComments.push(newComment);
        await this.afs.doc(`posts/${id}`).update({ comments: allComments });
    }

    convertReadableTime(_date: String) {
        if (_date === undefined)
            return _date;
        var datetimeObj: DateTime = this.setDateTime(datetimeObj, _date);
        var Result = Math.abs(this.dateTimeNow.day - datetimeObj.day) +
            Math.abs(this.dateTimeNow.month - datetimeObj.month) * 30 +
            Math.abs(this.dateTimeNow.month - datetimeObj.month) * 360 +
            Math.abs(this.dateTimeNow.hour - datetimeObj.hour) / 24 +
            Math.abs(this.dateTimeNow.minute - datetimeObj.minute) / 1440;
        var stringResult;
        if (Result > 360)
            stringResult = Math.ceil(Result / 360) + " yıl önce";
        else if (Result > 30)
            stringResult = Math.ceil(Result / 30) + " ay önce";
        else if (Result > 1)
            stringResult = Math.ceil(Result) + " gün önce";
        else if (Result > 0.041)
            stringResult = Math.ceil(Result * 0.041) + " saat önce";
        else if (Result >= 0.0007)
            stringResult = Math.ceil(Result * 0.0007) + " dakika önce";
        else
            stringResult = " az önce";
        return { "string": stringResult.toString(), "int": Result };
    }

    setDateTime(dateTime: DateTime, dateForSplit: String = null) { //update datetime for now
        var time, date;
        if (dateForSplit == null) {
            time = this.dateObj.toTimeString().split(' ')[0];
            date = this.dateObj.toISOString().split('T')[0];
        } else {
            var splitedDate = dateForSplit.split('/');
            time = splitedDate[0];
            date = splitedDate[1];
        }

        time = time.split(':');
        date = date.split('-');

        dateTime = {
            day: Number(date[2]),
            month: Number(date[1]),
            year: Number(date[0]),
            hour: Number(time[0]),
            minute: Number(time[1])
        }
        return dateTime;
    }

    getUID() {
        return this.post.owner_id;
    }

    setOwnerId(ownerid: string) {
        this.post.owner_id = ownerid;
    }

    getOwnerId() {
        return this.post.owner_id;
    }

}