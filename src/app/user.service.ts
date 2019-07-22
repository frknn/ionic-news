import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { first } from 'rxjs/operators';

interface User {
  username: string,
  uid: string,
}

@Injectable()
export class UserService {
  private user: User;

  constructor(private afAuth: AngularFireAuth) {

  }

  setUser(user: User) {
    this.user = user;
  }

  async isAuthenticated() {
    if (this.user) return true;

    const user = await this.afAuth.authState.pipe(first()).toPromise()

    if (user) {
      this.setUser({
        username: user.email,
        uid: user.uid
      })

      return true;
    }

    return false;
  }

  getUID() {
    return this.user.uid;
  }

  getUsername(){
    return this.user.username;
  }
}