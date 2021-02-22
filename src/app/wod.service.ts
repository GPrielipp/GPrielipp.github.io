import { Injectable, Output } from '@angular/core';
import { Subject } from 'rxjs';

import { WOD } from './wod.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable()
export class WODService {
  wods: WOD[] = [];
  loggedin: boolean = false;
  user: String;
  uri = "http://localhost";

  @Output() emitter: Subject<WOD> = new Subject<WOD>();
  @Output() deleter: Subject<WOD[]> = new Subject<WOD[]>();
  @Output() update: Subject<WOD> = new Subject<WOD>();
  @Output() loggedInEmitter: Subject<boolean> = new Subject<boolean>();

  updates: WOD[] = [];

  constructor(private http: HttpClient, private router: Router) {

  }

  register(username, password): boolean {
    let new_user = {
      username: username,
      password: password,
      wods: []
    }

    let ret: boolean;

    this.http.post(this.uri+":8000/api/register/", new_user).subscribe(ret => {
      if (ret['status'] == 500) {
        alert("User already exists");
        ret = false;
      } else {
        this.router.navigateByUrl(this.uri+":4200/login");
        ret = true;
      }
    });

    return ret;
  }

  login(username, password) {
    this.http.get<boolean>(this.uri+":8000/api/login/" + username + "/" + password).subscribe((ret) => {
        if (ret) {
          this.loggedin = true;
          this.user = username;
          this.router.navigateByUrl("/wods");
          this.loggedInEmitter.next(this.loggedin);
        } else {
          alert("Username or password incorrect");
        }
      });
  }

  setLoggedIn(arg: boolean) {
    this.loggedin = arg;
  }

  setUser(user: String) {
    this.user = user;
  }

  getWods() {
    return [...this.wods];
  }

  getWodsOnStart() {
    return this.http.get<WOD[]>('http://localhost:8000/api/wods/' + this.user).toPromise().then(
      (wods) => {
        this.wods = wods;
        return [...this.wods];
      }
    );
  }

  postWOD(wod: WOD) {
    this.wods.push(wod);
    this.emitter.next( wod );
    this.http.post('http://localhost:8000/api/wods/'+this.user, wod).subscribe(ret => {});
  }

  getUpdate() {
    // console.log(this.updates);
    this.update.next(this.updates.pop());
  }

  toUpdate(wod: WOD) {
    this.updates.push(wod);
    // console.log(this.updates);
  }

  updateWOD(wodID: String, wod: WOD) {
    this.wods.find((value, index, wods) => {
      if (value.id == wodID) {
        this.wods[index] = wod;
        return;
      }
    }, wodID);
    this.http.post('http://localhost:8000/api/wods/'+this.user+'/'+wodID, wod, { responseType: "text" }).subscribe(ret => {
      if (ret != "OK") {
        alert("Server responded: "+ret);
      }
    });
    this.deleter.next( this.getWods() ); // Should give it a more universal name but hey, it works
  }

  deleteWOD(wod: WOD) {
    this.wods.find((value, index, wods) => {
      if (value == wod) {
        this.wods.splice(index, 1);
        return index;
      }
    }, wod);
    this.deleter.next( this.getWods() );
    this.http.delete('http://localhost:8000/api/wods/'+this.user+'/'+wod.id).subscribe(ret => {
      // console.log(ret);
      ret = ret; // just to make sure everything doesn't crash with an empty function
    });
  }
}
