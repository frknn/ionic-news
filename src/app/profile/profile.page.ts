import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  userName: string;
  userLastname: string;
  userRank: string;
  userRankTitle: string;
  frontName: string;
  frontLastname: string;

  constructor(
    private user: UserService,
    private afs: AngularFirestore
  ) {
  }

  ngOnInit() {
    this.afs.doc<Object>(`users/${this.user.getUID()}`).valueChanges()
      .subscribe(mydata => {
        console.log(mydata);
        this.frontName = mydata["name"]
        this.frontLastname = mydata["lastname"]
        if(mydata["posts"]){
          console.log(mydata["posts"].length);
          if(mydata["posts"].length>=5){
            this.userRank = "../assets/icon/goldMedal.png"
            this.userRankTitle = "Gold Author"
          }else if(mydata["posts"].length<5 && mydata["posts"].length>=2){
            this.userRank = "../assets/icon/silverMedal.png"
            this.userRankTitle = "Silver Author"
          }else{
            this.userRank = "../assets/icon/bronzeMedal.png"
            this.userRankTitle = "Bronze Author"
          }
        }else{
          this.userRank = "../assets/icon/bronzeMedal.png"
          this.userRankTitle = "Bronze Author"
        }
      })

      
  }

  async updateName() {
    await this.afs.doc(`users/${this.user.getUID()}`).update(
      {
        name: this.userName,
        lastname: this.userLastname
      }
    );


    this.afs.doc<Object>(`users/${this.user.getUID()}`).valueChanges()
      .subscribe(mydata => {
        console.log(mydata);
        this.frontName = mydata["name"]
        this.frontLastname = mydata["lastname"]
      })
  }

}
