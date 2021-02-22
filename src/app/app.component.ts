import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WODService } from './wod.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'wod-tracker';
  loggedin;

  constructor (private router: Router, private service: WODService){
    this.loggedin = this.service.loggedin;
    this.service.setLoggedIn(false);
  };

  ngOnInit() {
    this.service.loggedInEmitter.subscribe((bool) => {
      this.loggedin = bool;
    })
  }

  logout() {
    this.loggedin = false;
    this.service.setLoggedIn(false);
    this.router.navigateByUrl("/login");
  }
}
